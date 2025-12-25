import { createClient } from '../../utils/supabase/server';
import { PromoDisplayModel } from '@/app/types';

// Helper to map deal + video + creator data to PromoDisplayModel
function mapToPromoDisplay(
  deal: any,
  videosMap: Map<string, any>,
  creatorsMap: Map<string, any>
): PromoDisplayModel {
  const video = videosMap.get(deal.video_id);
  const creator = creatorsMap.get(deal.channel_id);

  return {
    id: String(deal.id),
    code: deal.code,
    description: deal.description,
    headline: deal.headline || `Discount at ${deal.company}`,
    link: deal.link,
    expiresAt: null,
    isVerified: false,

    company: {
      name: deal.company,
      logoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company)}&background=random`,
      productType: deal.category?.toLowerCase() || 'other',
      link: null,
    },

    video: {
      videoID: deal.video_id || '',
      title: video?.title || 'Unknown Video',
      thumbnail: `https://i.ytimg.com/vi/${deal.video_id}/hqdefault.jpg`,
      publishedAt: video?.published_at ? new Date(video.published_at) : new Date(),

      creator: {
        name: creator?.creator_name || 'Unknown Creator',
        genre: deal.category?.toLowerCase() || 'other',
        profileURL: `https://youtube.com/channel/${deal.channel_id}`,
      },
    },
  };
}

export async function getLatestPromos(): Promise<PromoDisplayModel[]> {
  const supabase = await createClient();

  // 1. Fetch deals
  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('id, video_id, channel_id, headline, code, company, category, description, link')
    .order('id', { ascending: false })
    .limit(50);

  if (dealsError || !deals) {
    console.error('Error fetching deals:', dealsError);
    return [];
  }

  // 2. Get unique video_ids and channel_ids
  const videoIds = [...new Set(deals.map(d => d.video_id).filter(Boolean))];
  const channelIds = [...new Set(deals.map(d => d.channel_id).filter(Boolean))];

  // 3. Batch fetch videos by video_id
  const { data: videos } = await supabase
    .from('videos')
    .select('video_id, title, published_at')
    .in('video_id', videoIds);

  // 4. Batch fetch creators by channel_id
  const { data: creators } = await supabase
    .from('creators')
    .select('channel_id, creator_name')
    .in('channel_id', channelIds);

  // 5. Create lookup maps
  const videosMap = new Map((videos || []).map(v => [v.video_id, v]));
  const creatorsMap = new Map((creators || []).map(c => [c.channel_id, c]));

  // 6. Map to display model
  return deals.map(deal => mapToPromoDisplay(deal, videosMap, creatorsMap));
}

export async function getPromoById(id: string): Promise<PromoDisplayModel | null> {
  const supabase = await createClient();

  // 1. Fetch the deal
  const { data: deal, error: dealError } = await supabase
    .from('deals')
    .select('id, video_id, channel_id, headline, code, company, category, description, link')
    .eq('id', id)
    .single();

  if (dealError || !deal) {
    console.error('Error fetching deal by ID:', dealError);
    return null;
  }

  // 2. Fetch the video using deal's video_id
  const { data: video } = await supabase
    .from('videos')
    .select('video_id, title, published_at')
    .eq('video_id', deal.video_id)
    .single();

  // 3. Fetch the creator using deal's channel_id
  const { data: creator } = await supabase
    .from('creators')
    .select('channel_id, creator_name')
    .eq('channel_id', deal.channel_id)
    .single();

  // 4. Create maps for the helper
  const videosMap = new Map(video ? [[video.video_id, video]] : []);
  const creatorsMap = new Map(creator ? [[creator.channel_id, creator]] : []);

  return mapToPromoDisplay(deal, videosMap, creatorsMap);
}

export async function searchPromos(query: string): Promise<PromoDisplayModel[]> {
  const supabase = await createClient();

  // 1. Search deals
  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('id, video_id, channel_id, headline, code, company, category, description, link')
    .or(`company.ilike.%${query}%,code.ilike.%${query}%,headline.ilike.%${query}%,category.ilike.%${query}%`)
    .order('id', { ascending: false })
    .limit(50);

  if (dealsError || !deals) {
    console.error('Error searching deals:', dealsError);
    return [];
  }

  // 2. Get unique video_ids and channel_ids
  const videoIds = [...new Set(deals.map(d => d.video_id).filter(Boolean))];
  const channelIds = [...new Set(deals.map(d => d.channel_id).filter(Boolean))];

  // 3. Batch fetch videos
  const { data: videos } = await supabase
    .from('videos')
    .select('video_id, title, published_at')
    .in('video_id', videoIds);

  // 4. Batch fetch creators
  const { data: creators } = await supabase
    .from('creators')
    .select('channel_id, creator_name')
    .in('channel_id', channelIds);

  // 5. Create lookup maps
  const videosMap = new Map((videos || []).map(v => [v.video_id, v]));
  const creatorsMap = new Map((creators || []).map(c => [c.channel_id, c]));

  // 6. Map to display model
  return deals.map(deal => mapToPromoDisplay(deal, videosMap, creatorsMap));
}
