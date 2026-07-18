export const PLACEHOLDER = {
  // Shoe images from Unsplash (free, no key needed for basic usage)
  // Replace these URLs with real Cloudinary uploads after Phase 6

  shoes: {
    menSports:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    menCasual:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    menFormal:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
    womenHeels:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    womenSports:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
    kidsSports:
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80",
    sandals:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80",
    boots:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
  },

  lifestyle: {
    running:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    casual:
      "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&q=80",
    formal:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
  },

  categories: {
    men: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    women:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=80",
    kids: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=1200&q=80",
  },

  // Generic placeholder when nothing else fits
  generic: (width = 800, height = 800, text = "Shoe") =>
    `https://placehold.co/${width}x${height}/1A1A1A/C9933A?text=${encodeURIComponent(text)}`,
};

// Use this in seed.ts and any component needing a placeholder image
// When real photos are uploaded via admin, Cloudinary URLs will replace these
