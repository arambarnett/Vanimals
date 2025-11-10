# Deploy Updated Sprout NFT Contract

## What Changed
- Fixed `EOBJECT_EXISTS` error by appending unique counter to token names
- Added `u64_to_string()` helper function
- Each NFT now gets a unique name: "Sprout Trainer's Starter Sprout #0", "#1", "#2", etc.

## Deployment Steps

### 1. Compile the Contract
```bash
cd /Users/arambarnett/Vanimals/Vanimals/sprout-contracts
aptos move compile
```

**Expected output:**
```
Compiling, may take a little while to download git dependencies...
INCLUDING DEPENDENCY AptosFramework
INCLUDING DEPENDENCY AptosTokenObjects
BUILDING sprout_nft
Success
```

### 2. Test the Contract (Optional but Recommended)
```bash
aptos move test
```

### 3. Deploy to Testnet
```bash
aptos move publish --assume-yes
```

**What this does:**
- Publishes the updated contract to address `0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e`
- This is an **upgrade** since the module already exists at this address
- Aptos will check compatibility (new functions are OK, changing existing struct fields would fail)

**Expected output:**
```
Compiling, may take a little while to download git dependencies...
BUILDING sprout_nft
package size <X> bytes
Transaction submitted: 0x...
{
  "Result": {
    "transaction_hash": "0x...",
    "gas_used": <amount>,
    "success": true
  }
}
```

### 4. Verify Deployment
Check the transaction on Aptos Explorer:
```
https://explorer.aptoslabs.com/txn/0x<transaction_hash>?network=testnet
```

### 5. Test Minting
After deployment, test by connecting a new Petra wallet - it should now successfully mint!

## Troubleshooting

### Error: "Package upgrades are not compatible"
**Cause:** You changed an existing struct or removed a public function
**Solution:** Our changes only added new code, so this shouldn't happen. If it does, we need to deploy to a new address.

### Error: "INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE"
**Cause:** Admin account needs more APT for gas
**Solution:** Get testnet tokens from faucet:
```bash
aptos account fund-with-faucet --account 0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e
```

### Error: "Authentication key not found"
**Cause:** Wrong account configured
**Solution:** Make sure `.aptos/config.yaml` has the correct private key for the admin account

## After Deployment

1. ✅ Restart your backend (sprout-backend) to use the updated contract
2. ✅ Test Petra wallet connection → should mint successfully
3. ✅ Check user's Petra wallet → should see the NFT
4. ✅ Try hatching the egg → should work now!

## Important Notes

- **Network:** This deploys to Testnet (as configured in Move.toml with `rev = "mainnet"` but your address is on testnet)
- **Existing NFTs:** Already minted NFTs are unaffected and remain valid
- **Collection:** Your existing "Sprouts Collection" remains the same
- **No data loss:** This is an upgrade, not a redeployment
