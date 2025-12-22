import { PromoDisplayModel } from "../types";

export const mockPromos: PromoDisplayModel[] = [
  {
    id: "1",
    code: "MKBHD20",
    headline: "Get 20% off your first order",
    link: "https://dbrand.com/mkbhd",
    expiresAt: new Date("2025-03-01"),
    isVerified: true,
    company: {
      name: "dbrand",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Dbrand_logo.svg/512px-Dbrand_logo.svg.png",
      productType: "tech",
      link: "https://dbrand.com",
    },
    video: {
      videoID: "abc123",
      title: "The BEST Phone Skins of 2024",
      thumbnail: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      publishedAt: new Date("2024-12-15"),
      creator: {
        name: "Marques Brownlee",
        genre: "tech",
        profileURL: "https://youtube.com/@mkbhd",
      },
    },
  },
  {
    id: "2",
    code: "PEWDS",
    headline: "Free 30-day trial + 3 months free",
    link: "https://nordvpn.com/pewdiepie",
    expiresAt: null,
    isVerified: true,
    company: {
      name: "NordVPN",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/NordVPN-logo.svg/512px-NordVPN-logo.svg.png",
      productType: "tech",
      link: "https://nordvpn.com",
    },
    video: {
      videoID: "def456",
      title: "Gaming Setup Tour 2024",
      thumbnail: "https://i.ytimg.com/vi/def456/hqdefault.jpg",
      publishedAt: new Date("2024-11-20"),
      creator: {
        name: "PewDiePie",
        genre: "gaming",
        profileURL: "https://youtube.com/@pewdiepie",
      },
    },
  },
  {
    id: "3",
    code: "JAMES15",
    headline: "15% off all palettes",
    link: null,
    expiresAt: new Date("2025-01-15"),
    isVerified: true,
    company: {
      name: "Morphe",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Morphe_logo.svg/512px-Morphe_logo.svg.png",
      productType: "beauty",
      link: "https://morphe.com",
    },
    video: {
      videoID: "vxjgDnNW6Hw",
      title: "Full Glam Holiday Makeup Tutorial",
      thumbnail: "https://i.ytimg.com/vi/ghi789/hqdefault.jpg",
      publishedAt: new Date("2024-12-01"),
      creator: {
        name: "James Charles",
        genre: "beauty",
        profileURL: "https://youtube.com/@jamescharles",
      },
    },
  },
  {
    id: "4",
    code: "LINUS",
    headline: "Build your website free for 14 days",
    link: "https://squarespace.com/linus",
    expiresAt: null,
    isVerified: true,
    company: {
      name: "Squarespace",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Squarespace_logo_2019.svg/512px-Squarespace_logo_2019.svg.png",
      productType: "tech",
      link: "https://squarespace.com",
    },
    video: {
      videoID: "jkl012",
      title: "The ULTIMATE Home Server Build",
      thumbnail: "https://i.ytimg.com/vi/jkl012/hqdefault.jpg",
      publishedAt: new Date("2024-12-10"),
      creator: {
        name: "Linus Tech Tips",
        genre: "tech",
        profileURL: "https://youtube.com/@linustechtips",
      },
    },
  },
  {
    id: "5",
    code: "BINGING50",
    headline: "$50 off your first HelloFresh box",
    link: "https://hellofresh.com/bingingwithbabish",
    expiresAt: new Date("2025-02-28"),
    isVerified: true,
    company: {
      name: "HelloFresh",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/HelloFresh_Logo.svg/512px-HelloFresh_Logo.svg.png",
      productType: "food",
      link: "https://hellofresh.com",
    },
    video: {
      videoID: "mno345",
      title: "Binging with Babish: The Office Specials",
      thumbnail: "https://i.ytimg.com/vi/mno345/hqdefault.jpg",
      publishedAt: new Date("2024-11-25"),
      creator: {
        name: "Babish Culinary Universe",
        genre: "cooking",
        profileURL: "https://youtube.com/@babishculinaryuniverse",
      },
    },
  },
  {
    id: "6",
    code: "EMMA25",
    headline: "25% off first purchase",
    link: null,
    expiresAt: new Date("2025-04-01"),
    isVerified: false,
    company: {
      name: "Chamberlain Coffee",
      logoURL: "https://images.squarespace-cdn.com/content/v1/5f5e8592db4a007e0d84e556/1600118679906-chamberlain-coffee-logo.png",
      productType: "food",
      link: "https://chamberlaincoffee.com",
    },
    video: {
      videoID: "pqr678",
      title: "my morning routine (finally)",
      thumbnail: "https://i.ytimg.com/vi/pqr678/hqdefault.jpg",
      publishedAt: new Date("2024-10-15"),
      creator: {
        name: "Emma Chamberlain",
        genre: "other",
        profileURL: "https://youtube.com/@emmachamberlain",
      },
    },
  },
  {
    id: "7",
    code: "BEAST",
    headline: "Free shipping on orders over $50",
    link: null,
    expiresAt: null,
    isVerified: true,
    company: {
      name: "Feastables",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Feastables_logo.svg/512px-Feastables_logo.svg.png",
      productType: "food",
      link: "https://feastables.com",
    },
    video: {
      videoID: "stu901",
      title: "$1 vs $1,000,000 Hotel Room!",
      thumbnail: "https://i.ytimg.com/vi/stu901/hqdefault.jpg",
      publishedAt: new Date("2024-12-20"),
      creator: {
        name: "MrBeast",
        genre: "other",
        profileURL: "https://youtube.com/@mrbeast",
      },
    },
  },
  {
    id: "8",
    code: "NINJA",
    headline: "Get $5 off your first G FUEL tub",
    link: "https://gfuel.com/ninja",
    expiresAt: new Date("2025-06-01"),
    isVerified: true,
    company: {
      name: "G FUEL",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/G_Fuel_logo.svg/512px-G_Fuel_logo.svg.png",
      productType: "food",
      link: "https://gfuel.com",
    },
    video: {
      videoID: "vwx234",
      title: "Fortnite but I use EVERY weapon",
      thumbnail: "https://i.ytimg.com/vi/vwx234/hqdefault.jpg",
      publishedAt: new Date("2024-11-10"),
      creator: {
        name: "Ninja",
        genre: "gaming",
        profileURL: "https://youtube.com/@ninja",
      },
    },
  },
  {
    id: "9",
    code: "DRESS10",
    headline: "10% off sitewide",
    link: null,
    expiresAt: new Date("2025-01-31"),
    isVerified: true,
    company: {
      name: "Fashion Nova",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Fashion_Nova_logo.svg/512px-Fashion_Nova_logo.svg.png",
      productType: "fashion",
      link: "https://fashionnova.com",
    },
    video: {
      videoID: "yza567",
      title: "HUGE Fashion Nova Try-On Haul",
      thumbnail: "https://i.ytimg.com/vi/yza567/hqdefault.jpg",
      publishedAt: new Date("2024-12-05"),
      creator: {
        name: "Cardi B",
        genre: "music",
        profileURL: "https://youtube.com/@cardib",
      },
    },
  },
  {
    id: "10",
    code: "MATPAT",
    headline: "First month free on annual plan",
    link: "https://brilliant.org/gametheory",
    expiresAt: null,
    isVerified: true,
    company: {
      name: "Brilliant",
      logoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Brilliant_%28website%29_Logo.svg/512px-Brilliant_%28website%29_Logo.svg.png",
      productType: "tech",
      link: "https://brilliant.org",
    },
    video: {
      videoID: "bcd890",
      title: "Game Theory: The Science of Gaming",
      thumbnail: "https://i.ytimg.com/vi/bcd890/hqdefault.jpg",
      publishedAt: new Date("2024-11-30"),
      creator: {
        name: "The Game Theorists",
        genre: "gaming",
        profileURL: "https://youtube.com/@gametheory",
      },
    },
  },
];

// Helper to simulate search filtering
export function filterPromos(
  promos: PromoDisplayModel[],
  query: string
): PromoDisplayModel[] {
  const lowerQuery = query.toLowerCase();
  return promos.filter(
    (promo) =>
      promo.company.name.toLowerCase().includes(lowerQuery) ||
      promo.video.creator.name.toLowerCase().includes(lowerQuery) ||
      promo.video.creator.genre.toLowerCase().includes(lowerQuery) ||
      promo.code.toLowerCase().includes(lowerQuery) ||
      promo.headline.toLowerCase().includes(lowerQuery) ||
      promo.company.productType.toLowerCase().includes(lowerQuery)
  );
}

// Get a single promo by ID
export function getPromoById(id: string): PromoDisplayModel | undefined {
  return mockPromos.find((promo) => promo.id === id);
}

// Get all promos by creator name
export function getPromosByCreator(creatorName: string): PromoDisplayModel[] {
  return mockPromos.filter(
    (promo) => promo.video.creator.name.toLowerCase() === creatorName.toLowerCase()
  );
}
