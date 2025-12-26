import os
import sys
import json
import re
import feedparser
import psycopg2
import requests
from openai import OpenAI
from datetime import datetime, timezone
from time import mktime

# --- CONFIGURATION ---
# Use port 6543 (Supabase pooler) for GitHub Actions compatibility
DB_PARAMS = {
    "dbname": os.environ["DB_NAME"],
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
    "host": os.environ["DB_HOST"],
    "port": "6543",
    "connect_timeout": 10,
    "sslmode": "require"
}

# Initialize clients
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")

# Minimum video duration in seconds (skip shorts/very short videos)
MIN_DURATION_SECONDS = 240  # 4 minutes


def parse_iso8601_duration(duration: str) -> int:
    """Parse ISO 8601 duration (e.g., 'PT4M13S') to seconds."""
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def get_video_details(video_id: str) -> dict:
    """Fetch video details from YouTube Data API. Returns duration and channel title."""
    result = {"duration": 9999, "channel_title": None}
    
    if not YOUTUBE_API_KEY:
        return result
    
    try:
        url = f"https://www.googleapis.com/youtube/v3/videos?id={video_id}&part=contentDetails,snippet&key={YOUTUBE_API_KEY}"
        resp = requests.get(url, timeout=5)
        data = resp.json()
        
        if "items" in data and len(data["items"]) > 0:
            item = data["items"][0]
            duration_str = item["contentDetails"]["duration"]
            result["duration"] = parse_iso8601_duration(duration_str)
            result["channel_title"] = item["snippet"].get("channelTitle")
    except Exception as e:
        print(f"  --> Error fetching video details: {e}")
    
    return result


def get_channel_username(channel_id: str) -> str:
    """Fetch channel's @username from YouTube Data API."""
    if not YOUTUBE_API_KEY:
        return None
    
    try:
        url = f"https://www.googleapis.com/youtube/v3/channels?id={channel_id}&part=snippet&key={YOUTUBE_API_KEY}"
        resp = requests.get(url, timeout=5)
        data = resp.json()
        
        if "items" in data and len(data["items"]) > 0:
            custom_url = data["items"][0]["snippet"].get("customUrl", "")
            # customUrl is like "@username", return without the @
            return custom_url.lstrip("@") if custom_url else None
    except Exception as e:
        print(f"  --> Error fetching channel username: {e}")
    
    return None

SYSTEM_PROMPT = """Extract YouTube brand deals/discounts into a JSON list when the user provides a youtube video description. 
Rules:
- One object per deal.
- Exclude: Affiliate links without codes, storefronts (Amazon/Linktree), affiliate codes (e.g for in-game purchases), sales, or non-discounted products.
- If no deals exist, return an empty list for "deals".
- If no code is explicitly mentioned, try to infer it from the url. If you cannot infer it with relative certainty, leave the code as an empty string.
- The headline is a short, catchy title for the deal, like "10% off at Lululemon". 
- The description is a slightly longer description of the deal, like "Get 10% off your purchase at Lululemon when you use the code 'LULESAVE' at checkout."
- Return ONLY JSON."""

JSON_SCHEMA = {
    "name": "brand_deals_extraction",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "deals": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "Headline": {"type": "string"},
                        "Code": {"type": "string"},
                        "Company": {"type": "string"},
                        "Category": {"type": "string"},
                        "Description": {"type": "string"},
                        "Link": {"type": "string"}
                    },
                    "required": ["Headline", "Code", "Company", "Category", "Description", "Link"],
                    "additionalProperties": False
                }
            }
        },
        "required": ["deals"],
        "additionalProperties": False
    }
}

def extract_deals_from_video(description: str, title: str) -> list:
    """Uses OpenAI to extract deals from a video description."""
    if not description or not description.strip():
        return []
    
    max_chars = 8000
    if len(description) > max_chars:
        description = description[:max_chars] + "\n[truncated]"
    
    print(f"  --> Analyzing for deals: {title[:50]}...")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": description}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": JSON_SCHEMA
            },
            max_tokens=1000
        )
        content = response.choices[0].message.content
        if not content: return []
        deals_data = json.loads(content)
        return deals_data.get("deals", [])
    except Exception as e:
        print(f"  --> Error extracting deals: {e}")
        return []

def insert_video(cur, video_id: str, channel_id: str, title: str, description: str, 
                 published_at: str, creator_name: str = None, creator_username: str = None):
    """Inserts or updates a video in the videos table."""
    cur.execute("""
        INSERT INTO videos (video_id, channel_id, title, description, published_at, creator_name, creator_username)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (video_id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            creator_name = COALESCE(EXCLUDED.creator_name, videos.creator_name),
            creator_username = COALESCE(EXCLUDED.creator_username, videos.creator_username)
    """, (video_id, channel_id, title, description, published_at, creator_name, creator_username))

def insert_deals(cur, deals: list, video_id: str, channel_id: str):
    """Inserts deals, replacing old ones for the same company/code to keep them fresh."""
    inserted_count = 0
    for deal in deals:
        code = deal.get("Code", "").strip()
        if not code: continue
        
        company = deal.get("Company", "").strip()
        try:
            cur.execute("""
                DELETE FROM deals 
                WHERE LOWER(company) = LOWER(%s) AND LOWER(code) = LOWER(%s)
            """, (company, code))
            
            cur.execute("""
                INSERT INTO deals (video_id, channel_id, headline, code, company, category, description, link)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                video_id, channel_id, deal.get("Headline"), code, company,
                deal.get("Category"), deal.get("Description"), deal.get("Link")
            ))
            inserted_count += 1
        except Exception as e:
            print(f"  --> Error inserting deal: {e}")
    return inserted_count

def check_feeds():
    """Main function: checks RSS feeds using Date Cursor logic and excludes Shorts."""
    conn = None
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # FETCH: Get channel_id and last_checked_at to manage the cursor
        cur.execute("""
            SELECT channel_id, creator_name, last_checked_at 
            FROM big_promoters 
            WHERE channel_id IS NOT NULL
        """)
        creators = cur.fetchall()

        print(f"Checking feeds for {len(creators)} creators...")

        total_new_videos = 0
        total_deals_found = 0

        for row in creators:
            channel_id, creator_name, last_checked_at = row
            
            # Default to year 2000 if this is a new creator (fetches their recent history)
            if last_checked_at is None:
                last_checked_at = datetime(2000, 1, 1, tzinfo=timezone.utc)

            rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
            feed = feedparser.parse(rss_url)
            
            if feed.bozo and not feed.entries:
                print(f"  Error fetching feed for {channel_id}: {feed.bozo_exception}")
                continue

            # Fetch channel username once per channel (cache it)
            creator_username = get_channel_username(channel_id)

            # Track the newest video date found in this specific batch
            batch_max_date = last_checked_at

            for entry in feed.entries:
                video_id = getattr(entry, 'yt_videoid', None)
                if not video_id: continue

                # --- 1. DATE CHECK ---
                # Parse RSS timestamp to timezone-aware UTC datetime
                if not hasattr(entry, 'published_parsed'): continue
                published_time = datetime.fromtimestamp(mktime(entry.published_parsed), tz=timezone.utc)

                # SKIP if video is older than or equal to our last check
                if published_time <= last_checked_at:
                    continue

                # --- 2. SHORTS/DURATION CHECK ---
                title = getattr(entry, 'title', 'Untitled')
                if "#shorts" in title.lower():
                    continue
                
                # Fetch video details (duration + channel title for creator_name)
                video_details = get_video_details(video_id)
                if video_details["duration"] < MIN_DURATION_SECONDS:
                    print(f"  Skipping short video ({video_details['duration']}s): {title[:40]}...")
                    continue

                # We have a valid new video!
                print(f"\nNew video found: {title[:60]}...")
                total_new_videos += 1
                
                description = getattr(entry, 'summary', '')
                
                # Use channel title from API if available, fallback to DB value
                video_creator_name = video_details.get("channel_title") or creator_name

                # Update DB with creator info
                insert_video(cur, video_id, channel_id, title, description, published_time,
                            creator_name=video_creator_name, creator_username=creator_username)
                
                # Extract Deals
                deals = extract_deals_from_video(description, title)
                if deals:
                    inserted = insert_deals(cur, deals, video_id, channel_id)
                    total_deals_found += inserted
                    if inserted > 0: print(f"  --> Found {inserted} deal(s)!")

                # Update our batch tracker if this video is the newest so far
                if published_time > batch_max_date:
                    batch_max_date = published_time

            # --- 3. UPDATE CURSOR ---
            # If we found newer content, update the creator's timestamp in the DB
            if batch_max_date > last_checked_at:
                cur.execute(
                    "UPDATE big_promoters SET last_checked_at = %s WHERE channel_id = %s",
                    (batch_max_date, channel_id)
                )
                conn.commit()

        print(f"\n--- Summary ---")
        print(f"New videos processed: {total_new_videos}")
        print(f"Deals extracted: {total_deals_found}")
        return True

    except Exception as e:
        print(f"Fatal error: {e}")
        if conn: conn.rollback()
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    success = check_feeds()
    sys.exit(0 if success else 1)