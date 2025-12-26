import os
import sys
import json
import feedparser
import psycopg2
from openai import OpenAI
from datetime import datetime, timezone
from time import mktime

# --- CONFIGURATION ---
DB_PARAMS = {
    "dbname": os.environ["DB_NAME"],
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
    "host": os.environ["DB_HOST"],
    "port": "5432",
    "connect_timeout": 10
}

# Initialize OpenAI client
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = """Extract YouTube brand deals/discounts into a JSON list when the user provides a youtube video description. 
Rules:
- One object per deal.
- Exclude: Affiliate links without codes, storefronts (Amazon/Linktree), affiliate codes (e.g for in-game purchases), sales, or non-discounted products.
- If no deals exist, return an empty list for "deals".
- If no code is explicitly mentioned, try to infer it from the url. If you cannot infer it, leave the code as an empty string.
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

def insert_video(cur, video_id: str, channel_id: str, title: str, description: str, published_at: str):
    """Inserts or updates a video in the videos table."""
    cur.execute("""
        INSERT INTO videos (video_id, channel_id, title, description, published_at)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (video_id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description
    """, (video_id, channel_id, title, description, published_at))

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

                # --- 2. SHORTS CHECK ---
                title = getattr(entry, 'title', 'Untitled')
                if "#shorts" in title.lower():
                    # print(f"  Skipping Short: {title[:30]}...") 
                    continue

                # We have a valid new video!
                print(f"\nNew video found: {title[:60]}...")
                total_new_videos += 1
                
                description = getattr(entry, 'summary', '')

                # Update DB
                insert_video(cur, video_id, channel_id, title, description, published_time)
                
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