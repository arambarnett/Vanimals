// NFT Metadata API - Returns dynamic metadata for Sprout NFTs
import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

/**
 * Get NFT metadata for a specific sprout
 * This endpoint is called by wallet apps (Petra, OpenSea, etc.) to display NFT info
 *
 * Format follows OpenSea metadata standards:
 * https://docs.opensea.io/docs/metadata-standards
 */
router.get('/metadata/:sproutId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sproutId } = req.params;

    // Fetch sprout from database
    const sprout = await prisma.sprout.findUnique({
      where: { id: sproutId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!sprout) {
      res.status(404).json({ error: 'Sprout not found' });
      return;
    }

    // Base URL for Supabase storage
    // TODO: Update this with your actual Supabase storage URL
    const storageBaseUrl = 'https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public';

    // Determine image based on growth stage and species
    const imageUrl = getImageUrl(sprout.species, sprout.growthStage, sprout.rarity, storageBaseUrl);
    const animationUrl = get3DModelUrl(sprout.species, sprout.growthStage, storageBaseUrl);

    // Build metadata response
    const metadata = {
      name: sprout.name,
      description: buildDescription(sprout),
      image: imageUrl,
      animation_url: animationUrl, // 3D model for AR/VR display
      external_url: `https://sprouts.app/sprout/${sprout.id}`, // Link to your app

      // Attributes displayed in wallet apps
      attributes: [
        {
          trait_type: 'Species',
          value: capitalizeFirst(sprout.species),
        },
        {
          trait_type: 'Rarity',
          value: sprout.rarity,
        },
        {
          trait_type: 'Growth Stage',
          value: sprout.growthStage,
        },
        {
          trait_type: 'Level',
          value: sprout.level,
          display_type: 'number',
        },
        {
          trait_type: 'Health',
          value: sprout.healthPoints,
          max_value: 100,
          display_type: 'boost_percentage',
        },
        {
          trait_type: 'Mood',
          value: capitalizeFirst(sprout.mood),
        },
        {
          trait_type: 'Category',
          value: capitalizeFirst(sprout.category),
        },
        {
          trait_type: 'Grade',
          value: sprout.grade,
        },
      ],

      // Additional properties
      properties: {
        category: sprout.category,
        species: sprout.species,
        rarity: sprout.rarity,
        level: sprout.level,
        experience: sprout.experience,
        growthStage: sprout.growthStage,
        isWithering: sprout.isWithering,
        isDead: sprout.isDead,
        createdAt: sprout.createdAt.toISOString(),
      },
    };

    // Set cache headers (refresh every 5 minutes so wallets see updates)
    res.set('Cache-Control', 'public, max-age=300');
    res.json(metadata);
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    res.status(500).json({ error: 'Failed to fetch NFT metadata' });
  }
});

/**
 * Get metadata by NFT address (for on-chain lookups)
 */
router.get('/metadata-by-address/:nftAddress', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nftAddress } = req.params;

    const sprout = await prisma.sprout.findUnique({
      where: { nftAddress },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!sprout) {
      res.status(404).json({ error: 'Sprout not found' });
      return;
    }

    // Redirect to the main metadata endpoint
    res.redirect(`/api/nft/metadata/${sprout.id}`);
  } catch (error) {
    console.error('Error fetching NFT metadata by address:', error);
    res.status(500).json({ error: 'Failed to fetch NFT metadata' });
  }
});

/**
 * Helper: Build description text for NFT
 */
function buildDescription(sprout: any): string {
  const stage = sprout.growthStage;
  const species = capitalizeFirst(sprout.species);
  const category = sprout.category === 'starter' ? 'starter companion' : `${sprout.category} companion`;

  if (stage === 'Egg') {
    return `A mysterious ${species} egg waiting to hatch. This ${category} will grow as you achieve your goals!`;
  }

  const mood = sprout.mood === 'happy' ? '😊' : sprout.mood === 'sad' ? '😢' : '😐';
  return `A Level ${sprout.level} ${species} Sprout that grows with your ${sprout.category} goals. Currently feeling ${sprout.mood} ${mood}`;
}

/**
 * Helper: Get image URL based on species, growth stage, and rarity
 */
function getImageUrl(species: string, growthStage: string, rarity: string, baseUrl: string): string {
  // Format: sprouts/{species}_{growthStage}_{rarity}.png
  // Example: sprouts/bear_Sprout_Common.png
  const filename = `${species}_${growthStage}_${rarity}.png`;
  return `${baseUrl}/sprouts/${filename}`;
}

/**
 * Helper: Get 3D model URL for AR display
 */
function get3DModelUrl(species: string, growthStage: string, baseUrl: string): string | undefined {
  // Only return 3D models for non-egg stages
  if (growthStage === 'Egg') {
    return undefined;
  }

  // Format: models/{species}_{growthStage}.glb
  // Example: models/bear_Sprout.glb
  const filename = `${species}_${growthStage}.glb`;
  return `${baseUrl}/models/${filename}`;
}

/**
 * Helper: Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default router;
