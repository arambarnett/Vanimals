# Deployment Checklist - Fix Petra Wallet & NFT Metadata

## What We Fixed

### 1. Smart Contract Issue ✅
**Problem**: `EOBJECT_EXISTS` error when multiple users tried to mint
**Root Cause**: Token names weren't unique, causing address collisions
**Solution**: Append counter to token names ("Sprout Trainer's Starter Sprout #0", "#1", "#2"...)

### 2. Backend Database Issue ✅
**Problem**: Sprout records weren't being created (silent failure)
**Root Cause**: Used user's `walletAddress` for `nftAddress` field (not unique)
**Solution**: Generate unique NFT address: `${walletAddress.slice(0,20)}::${txHash.slice(0,20)}`

### 3. NFT Metadata Issue ✅
**Problem**: No images displayed in Petra wallet
**Root Cause**: Static URI didn't point to actual metadata
**Solution**: Created dynamic metadata API that returns proper NFT metadata JSON

## Deployment Steps

### Step 1: Deploy Smart Contract

```bash
cd /Users/arambarnett/Vanimals/Vanimals/sprout-contracts

# Compile to check for errors
aptos move compile

# If compilation succeeds, deploy
aptos move publish --assume-yes
```

**Expected Result**:
```
✅ Transaction submitted
✅ Success: true
```

**⚠️ Important**: Save the transaction hash and verify on explorer:
```
https://explorer.aptoslabs.com/txn/0x<TRANSACTION_HASH>?network=testnet
```

---

### Step 2: Set Up Supabase Storage

Follow instructions in `SUPABASE_STORAGE_SETUP.md`:

1. Create two public buckets:
   - `sprouts` (for images)
   - `models` (for 3D models)

2. Upload minimum 7 images:
   - `egg_Egg_Common.png` (universal egg)
   - `bear_Sprout_Common.png`
   - `deer_Sprout_Common.png`
   - `fox_Sprout_Common.png`
   - `owl_Sprout_Common.png`
   - `penguin_Sprout_Common.png`
   - `rabbit_Sprout_Common.png`

3. Test URLs are accessible:
```bash
curl -I https://fuznyncrufagipokvrub.supabase.co/storage/v1/object/public/sprouts/bear_Sprout_Common.png
# Should return: 200 OK
```

**⏳ Can Skip For Now**: If you don't have images yet, the metadata API will work but show broken images. You can upload images later and they'll appear automatically.

---

### Step 3: Update Backend Environment

Add to `sprout-backend/_env`:
```bash
BASE_URL=https://68d80f1c6206.ngrok-free.app
```

This is used for the NFT metadata URI.

---

### Step 4: Restart Backend

```bash
cd /Users/arambarnett/Vanimals/Vanimals/sprout-backend

# Stop current backend (Ctrl+C if running)

# Start with new code
npm run dev
```

**Expected Output**:
```
🚀 Server is running on port 3000
✅ Sprouts Backend Ready!
```

**⚠️ Important**: Make sure you see the new NFT endpoint in the logs:
```
NFT:
- GET /api/nft/metadata/:sproutId
```

---

### Step 5: Update Ngrok (If Needed)

If your ngrok URL changed, update it in:
- `sprout-backend/_env` → `BASE_URL`
- `sprouts_flutter/lib/core/constants/app_constants.dart` → `baseUrl`

Current ngrok: `https://68d80f1c6206.ngrok-free.app`

---

### Step 6: Test Metadata API

Before testing the full flow, verify the metadata API works:

```bash
# Test with a real sprout ID from your database
curl http://localhost:3000/api/nft/metadata/cmh4y4e5z00002gy4amm4ru09

# Should return JSON with:
# - name
# - description
# - image (URL)
# - attributes[]
```

---

### Step 7: Test Full Flow (Petra Wallet)

Now test the complete user flow:

1. **Open Flutter App**
2. **Disconnect any existing wallet** (to start fresh)
3. **Tap "Connect with Petra Wallet"**
4. **Petra opens** → Approve connection
5. **Backend receives callback** → Check logs:
   ```
   ✅ Petra wallet address received: 0x...
   📝 Saved userId: xxx
   ```
6. **NFT Minting** → Check logs:
   ```
   🔍 Connect external wallet request: {...}
   ✅ Minted starter Sprout egg for external wallet user xxx: 0x...
   ```
7. **Check Aptos Explorer**:
   ```
   https://explorer.aptoslabs.com/account/0x<YOUR_WALLET_ADDRESS>?network=testnet
   ```
   - Should show successful transaction (green checkmark)
   - **Not** "EOBJECT_EXISTS" error

8. **Check Petra Wallet Collectibles Tab**:
   - Should see "Sprout Trainer's Starter Sprout #X"
   - Should show image (if uploaded to Supabase)
   - Click to view details → should show attributes

9. **Try Hatching**:
   - Navigate to egg hatching screen
   - Enter name
   - Tap "Hatch"
   - Should succeed with message: "Egg hatched successfully! 🎉"

---

### Step 8: Test Second User

The real test is whether a SECOND user can mint:

1. **Get a second test wallet** (different Petra account or different device)
2. **Connect with Petra**
3. **Check transaction succeeds** (not EOBJECT_EXISTS)
4. **Check they have their own egg** (different token number: #1, #2, etc.)

---

## Troubleshooting

### Error: "EOBJECT_EXISTS" (still happening)
**Cause**: Smart contract not deployed yet
**Solution**: Go back to Step 1, deploy the updated contract

### Error: "No egg found to hatch"
**Cause**: NFT minting failed silently
**Solution**: Check backend logs for the actual error in the try/catch block

### Error: "Failed to fetch NFT metadata"
**Cause**: Metadata API not registered
**Solution**: Make sure you restarted backend after adding nft routes

### Error: Broken image in Petra wallet
**Cause**: Image not uploaded to Supabase or wrong filename
**Solution**:
- Check the metadata API returns the correct image URL
- Verify the image exists at that URL (curl -I <url>)
- Check filename matches pattern: `{species}_{growthStage}_{rarity}.png`

### Error: "Package upgrades are not compatible"
**Cause**: Breaking change in Move contract
**Solution**: Our changes only add code, so this shouldn't happen. If it does, DM me.

---

## Verification Checklist

After deployment, verify:

- [ ] Smart contract deployed (check Aptos Explorer)
- [ ] Backend restarted with new code
- [ ] Metadata API responds: `curl localhost:3000/api/nft/metadata/<sproutId>`
- [ ] First user can connect Petra successfully
- [ ] First user's transaction succeeds (green checkmark on explorer)
- [ ] First user has an egg to hatch
- [ ] First user can hatch egg successfully
- [ ] Second user can also connect Petra (no EOBJECT_EXISTS)
- [ ] Second user has their own egg (#1, #2, etc.)
- [ ] NFT shows in Petra wallet with image/attributes

---

## Summary of Changes

### Files Modified:
1. `sprout-contracts/sources/sprout_nft.move` - Added unique token naming
2. `sprout-backend/src/routes/walletAuth.ts` - Fixed NFT address uniqueness + dynamic URIs
3. `sprout-backend/src/routes/nft.ts` - NEW: Metadata API endpoint
4. `sprout-backend/src/index.ts` - Registered NFT routes

### Files Created:
1. `DEPLOY.md` - Smart contract deployment guide
2. `SUPABASE_STORAGE_SETUP.md` - Image hosting setup
3. `DEPLOYMENT_CHECKLIST.md` - This file

---

## Next Steps After Deployment

1. **Upload more images**:
   - Add rarity variants (Rare, Epic, Legendary)
   - Add growth stage variants (Seedling, Plant, Tree)

2. **Add color customization**:
   - Store user color preferences in database
   - Generate dynamic images or use CSS filters

3. **Add 3D models**:
   - Upload GLB files to Supabase
   - Metadata API already supports `animation_url`

4. **Test on mainnet**:
   - Change Move.toml network from testnet to mainnet
   - Deploy to production ngrok/domain
   - Update Supabase URLs to production

---

## Need Help?

If you encounter issues:
1. Check backend logs for detailed error messages
2. Check Aptos Explorer for transaction details
3. Verify all environment variables are set correctly
4. Make sure ngrok is running and URL matches everywhere

Good luck! 🚀
