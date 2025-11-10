# Supabase Storage Setup for Sprout NFT Images

## Overview
This guide shows you how to set up Supabase Storage for hosting NFT images and 3D models.

## Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `fuznyncrufagipokvrub`
3. Click **Storage** in the left sidebar
4. Create two new buckets:

### Bucket 1: `sprouts` (for 2D images)
```
Name: sprouts
Public: ✅ Yes (so wallet apps can load images)
File size limit: 5 MB
Allowed MIME types: image/png, image/jpeg, image/webp
```

### Bucket 2: `models` (for 3D models)
```
Name: models
Public: ✅ Yes
File size limit: 50 MB
Allowed MIME types: model/gltf-binary, model/gltf+json
```

## Step 2: Upload NFT Images

### File Naming Convention
Images should follow this pattern:
```
{species}_{growthStage}_{rarity}.png
```

### Examples:
```
sprouts/bear_Egg_Common.png          # Bear egg (all rarities same for eggs)
sprouts/bear_Sprout_Common.png       # Common bear sprout
sprouts/bear_Sprout_Rare.png         # Rare bear sprout
sprouts/bear_Sprout_Epic.png         # Epic bear sprout
sprouts/bear_Sprout_Legendary.png    # Legendary bear sprout
sprouts/bear_Seedling_Common.png     # Bear in seedling stage
sprouts/bear_Plant_Common.png        # Bear in plant stage
sprouts/bear_Tree_Common.png         # Bear in tree stage (fully grown)
```

### Upload for all 6 species:
- bear
- deer
- fox
- owl
- penguin
- rabbit

### Growth Stages (minimum needed):
1. **Egg** - Universal egg image (same for all species)
2. **Sprout** - Baby form
3. **Seedling** - Medium form (optional for launch)
4. **Plant** - Advanced form (optional for launch)
5. **Tree** - Final form (optional for launch)

### Quick Start (Minimum Viable Product):
For launch, you only need:
- 1 egg image: `egg_Egg_Common.png` (used for all species)
- 6 sprout images: `{species}_Sprout_Common.png`

**Total: 7 images to get started!**

## Step 3: Upload via Supabase Dashboard

1. In Storage → `sprouts` bucket
2. Click **Upload file**
3. Select your PNG files
4. Files will be accessible at:
```
https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/sprouts/{filename}
```

## Step 4: Upload 3D Models (Optional - For Future AR)

3D models should be in GLB format (binary GLTF):
```
models/{species}_{growthStage}.glb
```

Examples:
```
models/bear_Sprout.glb
models/bear_Seedling.glb
models/bear_Plant.glb
models/bear_Tree.glb
```

## Step 5: Update Metadata API

The metadata API at `sprout-backend/src/routes/nft.ts` is already configured to use:
- Base URL: `https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public`
- Images: `{baseUrl}/sprouts/{species}_{growthStage}_{rarity}.png`
- Models: `{baseUrl}/models/{species}_{growthStage}.glb`

## Step 6: Set Storage Policies (Security)

By default, public buckets allow read access. To prevent unauthorized uploads:

1. Go to Storage → sprouts → Policies
2. Keep the default policy:
   - **SELECT (read)**: Enabled for public
   - **INSERT (upload)**: Disabled for public (only service role can upload)

This means:
- ✅ Anyone can view images (needed for wallets)
- ❌ Only your backend can upload new images (via service role key)

## Step 7: Test Image URLs

After uploading, test that images are accessible:

```bash
# Test egg image
curl -I https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/sprouts/bear_Egg_Common.png

# Should return: HTTP/2 200
```

## Placeholder Images (For Testing)

If you don't have images yet, you can use placeholder URLs in the metadata API:

```typescript
// In nft.ts, update getImageUrl() temporarily:
function getImageUrl(species: string, growthStage: string, rarity: string, baseUrl: string): string {
  // Temporary: Use placeholder service
  return `https://via.placeholder.com/512x512/4A90E2/ffffff?text=${species}+${growthStage}`;
}
```

Then replace with real images once ready.

## Image Specifications

### Recommended Specs:
- **Format**: PNG with transparency
- **Size**: 512x512 px (square, standard for NFTs)
- **Background**: Transparent
- **File size**: < 500 KB per image
- **Color space**: sRGB

### For 3D Models:
- **Format**: GLB (not GLTF + separate textures)
- **Polycount**: < 50K triangles (mobile-friendly)
- **Textures**: Embedded in GLB
- **File size**: < 5 MB per model

## URL Examples (After Setup)

Once uploaded, your NFT metadata will return:

```json
{
  "name": "Sprout Trainer's Starter Sprout #0",
  "description": "A bear Sprout that grows with your fitness goals",
  "image": "https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/sprouts/bear_Sprout_Common.png",
  "animation_url": "https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/models/bear_Sprout.glb",
  "attributes": [...]
}
```

## Next Steps

1. ✅ Create `sprouts` and `models` buckets
2. ✅ Upload at least 7 starter images (1 egg + 6 species sprouts)
3. ✅ Test URLs are publicly accessible
4. ✅ Deploy backend with metadata API
5. ✅ Mint a test NFT and check Petra wallet displays the image!

## Future Enhancements

- Add rarity variants (Rare, Epic, Legendary) with different colors/accessories
- Add growth stage variants (Seedling, Plant, Tree)
- Add 3D models for AR viewing
- Add seasonal/special edition variants
- Implement dynamic image generation based on user customization
