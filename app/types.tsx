export const GENRES = [
  "music",
  "gaming",
  "cooking",
  "beauty",
  "tech",
  "other",
] as const;
export type Genre = (typeof GENRES)[number];

export const PRODUCT_TYPES = [
  "fashion",
  "beauty",
  "food",
  "tech",
  "gaming",
  "cooking",
  "other",
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export interface DbCreator {
  id: string; // UUID or Primary Key
  name: string;
  channel_id: string; // The YouTube Channel ID
  profile_url: string;
  genre: Genre;
  created_at: string;
}

export interface DbCompany {
  id: string;
  name: string;
  logo_url: string;
  product_type: ProductType;
  link: string | null;
}

export interface DbVideo {
  id: string;
  creator_id: string; // Foreign Key to DbCreator
  youtube_video_id: string; // The "v=" part of the URL
  title: string;
  thumbnail_url: string;
  published_at: string;
}

export interface DbPromo {
  id: string;
  video_id: string; // Foreign Key to DbVideo
  company_id: string; // Foreign Key to DbCompany
  code: string;
  headline: string;
  description: string;
  link: string | null;
  added_at: string;
  expires_at: string | null; 
  is_verified: boolean; 

}

export type PromoDisplayModel = {
  id: string;
  code: string;
  headline: string;
  description: string;
  link: string | null;
  expiresAt: Date | null;
  isVerified: boolean;

  // Joined Data
  company: {
    name: string;
    logoURL: string;
    productType: ProductType;
    link: string | null;
  };

  video: {
    videoID: string;
    title: string;
    thumbnail: string;
    publishedAt: Date;
    creator: {
      name: string;
      genre: Genre;
      profileURL: string;
    };
  };
};
