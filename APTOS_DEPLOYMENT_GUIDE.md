# Aptos Contract Deployment Guide (No Full Node Required!)

## Quick Setup - Aptos CLI Only

You don't need to run a full blockchain node! The Aptos CLI connects to public testnet/mainnet nodes.

### 1. Install Aptos CLI

**macOS:**
```bash
brew install aptos
```

**Or use pre-built binary:**
```bash
# Download latest release
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
aptos --version
```

### 2. Initialize Aptos Account (Testnet)

```bash
cd sprout-contracts

# Initialize testnet profile
aptos init --network testnet

# This will:
# 1. Generate a new keypair
# 2. Save to ~/.aptos/config.yaml
# 3. Create a testnet account
# 4. Fund it with test APT tokens (automatically!)
```

**Example output:**
```
Aptos CLI is now set up for account 0x1234...abcd at profile default
```

**Save these values:**
- Private Key: (stored in `~/.aptos/config.yaml`)
- Public Key: (shown in output)
- Account Address: `0x1234...abcd` (this is your deployer address)

### 3. Update Move.toml with Your Address

```bash
cd sprout-contracts
```

Edit `Move.toml`:
```toml
[addresses]
sprout_addr = "0xYOUR_TESTNET_ADDRESS_HERE"  # Replace with your address from step 2
```

### 4. Compile the Contract

```bash
aptos move compile --named-addresses sprout_addr=0xYOUR_ADDRESS
```

**Expected output:**
```
{
  "Result": [
    "sprout_addr::sprout_nft"
  ]
}
```

### 5. Deploy to Testnet

```bash
aptos move publish --named-addresses sprout_addr=0xYOUR_ADDRESS --profile default
```

**You'll see:**
```
Do you want to publish this package at object address 0x... [yes/no] > yes

Transaction submitted: https://explorer.aptoslabs.com/txn/0x...
{
  "Result": {
    "transaction_hash": "0x...",
    "gas_used": 1234,
    "success": true
  }
}
```

### 6. Save Contract Address

After deployment, your contract address is: **`0xYOUR_ADDRESS`** (same as deployer address for named addresses)

Add to backend `_env`:
```bash
APTOS_NETWORK=testnet
APTOS_CONTRACT_ADDRESS=0xYOUR_ADDRESS
APTOS_RPC_URL=https://fullnode.testnet.aptoslabs.com/v1
```

---

## Testing the Contract

### Initialize the Collection

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::sprout_nft::initialize_collection' \
  --profile default
```

### Mint a Test Sprout

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::sprout_nft::mint_sprout' \
  --args \
    address:0xRECIPIENT_ADDRESS \
    string:"My First Sprout" \
    string:"Dragon" \
    string:"Common" \
    string:"https://sprouts.app/nft/1.json" \
  --profile default
```

### View Sprout Stats

```bash
aptos move view \
  --function-id 'YOUR_ADDRESS::sprout_nft::get_sprout_stats' \
  --args address:0xTOKEN_ADDRESS
```

---

## Useful Aptos Commands

```bash
# Check account balance
aptos account list --profile default

# Get more test APT tokens
aptos account fund-with-faucet --account YOUR_ADDRESS --amount 100000000

# View transaction details
aptos transaction show --hash 0xTRANSACTION_HASH

# List all resources in your account
aptos account list --account YOUR_ADDRESS
```

---

## Cost Estimates

**Testnet:** FREE (test tokens from faucet)

**Mainnet:**
- Deploy contract: ~0.05 APT (~$0.40)
- Mint NFT: ~0.002 APT (~$0.016)
- Update NFT stats: ~0.001 APT (~$0.008)

---

## Aptos Explorer Links

- **Testnet Explorer:** https://explorer.aptoslabs.com/?network=testnet
- **Your Account:** https://explorer.aptoslabs.com/account/YOUR_ADDRESS?network=testnet
- **View Transactions:** Check deployment and mints in real-time

---

## Troubleshooting

**Error: Insufficient balance**
```bash
aptos account fund-with-faucet --account YOUR_ADDRESS --amount 100000000
```

**Error: Module already exists**
- You're trying to redeploy to the same address
- Either use a new address or use upgrade process

**Error: Named address not defined**
- Make sure `Move.toml` has your address set correctly
- Use `--named-addresses sprout_addr=0xYOUR_ADDRESS` in commands

---

## Next Steps After Deployment

1. ✅ Copy contract address to backend `_env`
2. ✅ Test minting from backend
3. ✅ Update Flutter app with contract address
4. ✅ Test full flow: Login → Mint Sprout → View in app
