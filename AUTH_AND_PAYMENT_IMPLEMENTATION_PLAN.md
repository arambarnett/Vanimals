# Auth & Payment Implementation Plan

## Completed ✅

### 1. Fix Prisma Connection Pooling
**Status**: ✅ Complete
**Files Modified**:
- Created `/sprout-backend/src/lib/prisma.ts` - Singleton Prisma client
- Updated all route files to use singleton instead of creating new instances

**Why**: Supabase connection pooler was throwing "prepared statement does not exist" errors due to multiple PrismaClient instances.

### 2. Add Wallet Address to Settings
**Status**: ✅ Complete
**Files Modified**:
- `sprouts_flutter/lib/presentation/screens/settings_screen.dart`

**Features Added**:
- Wallet address displayed in user profile card
- Truncated format: `0x5f35...0aff`
- Copy to clipboard button
- Clean UI with semi-transparent card

---

## Phase 2: Auth Improvements

### 3. Fix Double Logout Issue
**Status**: ✅ Complete

**Implementation**:
- Close confirmation dialog immediately
- Show non-dismissible loading spinner during logout
- Execute all logout operations (Web3Auth, Strava, UserPreferences)
- Navigate to home screen with clean navigation stack

**Fixed Code**:
```dart
// In settings_screen.dart logout function:
onPressed: () async {
  Navigator.of(context).pop(); // Close dialog FIRST

  // Show loading indicator
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (context) => Center(child: CircularProgressIndicator()),
  );

  try {
    await Web3AuthService.signOut();
    await StravaAuthService.disconnectStrava();
    UserPreferences.reset();
  } catch (e) {
    print('Error: $e');
  }

  // Close loading, navigate to login
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute(builder: (context) => VanimalHomeScreen()),
    (route) => false,
  );
}
```

### 4. Add Signup vs Login UI Distinction
**Status**: Pending
**Current Issue**: All auth flows look identical - no way to know if you're signing up or logging in

**Proposed Changes**:

**A. Update Login Screen**
File: `main.dart` or `login_screen.dart`

Add tabs or buttons:
```
┌─────────────────────────────┐
│     Welcome to Sprouts      │
├─────────────────────────────┤
│  [Sign Up]  |  [Login]      │ ← Tabs
├─────────────────────────────┤
│                             │
│  🔵 Continue with Google    │
│  🍎 Continue with Apple     │
│  💼 Connect Aptos Wallet    │ ← NEW
│                             │
└─────────────────────────────┘
```

**B. Add Welcome Flow for New Users**
- Check `isNewUser` flag from backend response
- Show onboarding steps:
  1. Welcome screen with app features
  2. "Create Your First Goal" prompt
  3. Auto-navigate to hatching screen when egg mints

### 5. Add Native Aptos Wallet Connection
**Status**: ✅ Complete

**Why**: Users with existing Aptos wallets (Petra, Pontem, Martian) can now connect directly.

**Implementation Complete**:

**Files Created**:
- `/sprouts_flutter/lib/data/services/aptos_native_wallet_service.dart` - Native wallet connection service
- `/sprouts_flutter/lib/presentation/screens/wallet_selection_screen.dart` - Wallet selection UI
- Updated `/sprouts_flutter/lib/main.dart` - Added "Connect Aptos Wallet" button
- Updated `/sprout-backend/src/routes/walletAuth.ts` - Added `/connect-external-wallet` endpoint

**Supported Wallets**:
- Petra Wallet (most popular)
- Pontem Wallet
- Martian Wallet
- Nightly Wallet

**Features**:
- Detect installed wallets
- Manual wallet address input as fallback
- Deep linking to wallet apps (for future integration)
- Backend verification and user creation

```dart
class AptosWalletConnector {
  // Detect installed wallets
  static Future<List<String>> getAvailableWallets() async {
    // Check for Petra, Pontem, Martian
  }

  // Connect to wallet
  static Future<String?> connectWallet(String walletType) async {
    // Use wallet-specific connection flow
    // Return wallet address
  }

  // Sign message for verification
  static Future<String?> signMessage(String message) async {
    // Prove ownership of wallet
  }
}
```

**C. Update Backend**
Add endpoint: `POST /api/auth/connect-external-wallet`

```typescript
router.post('/connect-external-wallet', async (req, res) => {
  const { walletAddress, signature, message } = req.body;

  // Verify signature
  const isValid = await aptosService.verifySignature(
    walletAddress,
    message,
    signature
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Create or update user with this wallet
  // No socialProviderId - use walletAddress as primary ID
});
```

**D. UI Flow**
```
Login Screen
  ↓
User clicks "Connect Aptos Wallet"
  ↓
Show wallet selection:
- Petra ✅ (installed)
- Pontem ❌ (not installed) → Link to install
- Martian ✅ (installed)
  ↓
User selects Petra
  ↓
Petra popup: "Sign message to verify ownership"
  ↓
User signs
  ↓
Backend verifies signature
  ↓
Create account or login
```

---

## Phase 3: APT Payment System

### 6. Add APT Token Payments
**Status**: ✅ Complete

**Implementation**: Users can now buy food with APT tokens in addition to points.

**Files Created/Modified**:
- Created `/sprout-backend/src/services/aptosPaymentService.ts` - Payment verification service
- Updated `/sprout-backend/src/routes/food.ts` - Added APT purchase endpoints
- Updated `/sprout-backend/prisma/schema.prisma` - Added `txHash` and `aptAmount` fields to FoodTransaction

**APT Pricing**:
- **Small Pack**: 50 food for 0.1 APT (~$0.80)
- **Medium Pack**: 150 food for 0.25 APT (~$2.00)
- **Large Pack**: 500 food for 0.75 APT (~$6.00)

**Payment Verification**:
The `AptosPaymentService` verifies transactions by checking:
1. Transaction exists and succeeded on-chain
2. Sender matches user's wallet address
3. Recipient is the treasury wallet
4. Amount matches expected APT value (with 1% tolerance)
5. Transaction is recent (within 10 minutes)
6. Transaction hash hasn't been used before (prevents replay attacks)

**API Endpoints Added**:
- `GET /api/food/apt-packages` - List available food packages with APT pricing
- `POST /api/food/purchase-with-apt` - Purchase food with APT payment

**B. Payment Service Implementation**
File: `/sprout-backend/src/services/aptosPaymentService.ts`

```typescript
export class AptosPaymentService {
  private readonly TREASURY_WALLET = process.env.TREASURY_WALLET_ADDRESS;

  // Verify APT payment
  async verifyPayment(
    txHash: string,
    expectedAmount: number,
    fromAddress: string
  ): Promise<boolean> {
    const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

    // Get transaction details
    const tx = await aptos.getTransactionByHash({ transactionHash: txHash });

    // Verify:
    // 1. Transaction succeeded
    // 2. Sender matches fromAddress
    // 3. Receiver is TREASURY_WALLET
    // 4. Amount matches expectedAmount
    // 5. Transaction is recent (< 5 mins old)

    return verified;
  }
}
```

**C. Update Food Purchase Endpoint**
File: `/sprout-backend/src/routes/food.ts`

```typescript
router.post('/purchase-with-apt', async (req, res) => {
  const { userId, packageType, txHash } = req.body;

  const pkg = FOOD_PACKAGES.find(p => p.name === packageType);
  if (!pkg) {
    return res.status(400).json({ error: 'Invalid package' });
  }

  // Verify APT payment on-chain
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const paymentService = new AptosPaymentService();
  const isValid = await paymentService.verifyPayment(
    txHash,
    pkg.aptCost,
    user.walletAddress
  );

  if (!isValid) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  // Add food to inventory
  await prisma.food.update({
    where: { userId },
    data: { amount: { increment: pkg.food } }
  });

  // Record transaction
  await prisma.foodTransaction.create({
    data: {
      userId,
      amount: pkg.food,
      source: 'apt_purchase',
      aptAmount: pkg.aptCost,
      txHash
    }
  });

  res.json({ success: true, newBalance: ... });
});
```

**D. Update Flutter UI**
File: `/sprouts_flutter/lib/presentation/screens/eggs_nursery_screen.dart`

Add payment method selector:
```dart
// In _buildFoodPackageCard
Row(
  children: [
    // Points payment button
    ElevatedButton.icon(
      onPressed: () => _purchaseWithPoints(...),
      icon: Icon(Icons.star),
      label: Text('$pointsCost Points'),
    ),
    SizedBox(width: 12),
    // APT payment button
    ElevatedButton.icon(
      onPressed: () => _purchaseWithAPT(...),
      icon: Icon(Icons.currency_bitcoin),
      label: Text('$aptCost APT'),
    ),
  ],
)
```

**E. APT Payment Flow**
```
User clicks "Buy with APT"
  ↓
Show confirmation dialog with APT amount
  ↓
User confirms
  ↓
Trigger Aptos wallet transaction:
- To: TREASURY_WALLET
- Amount: 0.25 APT
  ↓
User approves in wallet (Petra/Web3Auth)
  ↓
Get txHash from wallet
  ↓
Send to backend for verification
  ↓
Backend verifies on-chain
  ↓
Add food to inventory
  ↓
Show success message
```

---

## Phase 4: Sprout Purchases with APT

### 7. Buy Additional Sprouts
**Status**: Pending

**Concept**: Allow users to purchase additional Sprout eggs with APT

**Egg Types & Pricing**:
```typescript
const SPROUT_EGGS = [
  {
    type: 'Common Egg',
    rarity: 'Common',
    aptCost: 1.0,  // 1 APT = ~$8
    description: 'Random common species',
    species: ['bear', 'deer', 'fox', 'owl', 'penguin', 'rabbit']
  },
  {
    type: 'Rare Egg',
    rarity: 'Rare',
    aptCost: 5.0,  // 5 APT = ~$40
    description: 'Random rare species with boosted stats',
    species: ['dragon', 'phoenix', 'griffin']
  },
  {
    type: 'Epic Egg',
    rarity: 'Epic',
    aptCost: 10.0,  // 10 APT = ~$80
    description: 'Random epic species with max stats',
    species: ['unicorn', 'leviathan', 'celestial']
  }
];
```

**Implementation**:
1. Add "Eggs" section to Store tab
2. Show egg cards with APT prices
3. Purchase flow similar to food
4. Mint new Sprout NFT on-chain
5. Add to user's collection in Egg state

---

## Phase 5: Sprout Transfer System

### 8. Transfer Sprouts Between Wallets
**Status**: Pending

**Use Case**: User wants to:
- Transfer Sprout to different wallet they own
- Gift Sprout to friend
- Move from social login wallet to hardware wallet

**Implementation**:

**A. Add Transfer Button**
Location: Sprout detail screen

```dart
ElevatedButton.icon(
  onPressed: _showTransferDialog,
  icon: Icon(Icons.send),
  label: Text('Transfer Sprout'),
)
```

**B. Transfer Dialog**
```dart
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: Text('Transfer Sprout'),
    content: Column(
      children: [
        TextField(
          decoration: InputDecoration(
            label Text('Recipient Wallet Address'),
            hintText: '0x...',
          ),
          controller: recipientController,
        ),
        SizedBox(height: 16),
        Text(
          'Warning: This action cannot be undone. Make sure the address is correct.',
          style: TextStyle(color: Colors.red),
        ),
      ],
    ),
    actions: [
      TextButton(child: Text('Cancel'), onPressed: () => Navigator.pop(context)),
      ElevatedButton(
        child: Text('Transfer'),
        onPressed: () => _executeTransfer(),
      ),
    ],
  ),
);
```

**C. Backend Transfer Endpoint**
```typescript
router.post('/transfer/:sproutId', async (req, res) => {
  const { sproutId } = req.params;
  const { fromUserId, toWalletAddress, signature } = req.body;

  // 1. Verify user owns this Sprout
  const sprout = await prisma.sprout.findUnique({
    where: { id: sproutId },
    include: { user: true }
  });

  if (sprout.userId !== fromUserId) {
    return res.status(403).json({ error: 'Not your Sprout' });
  }

  // 2. Verify signature to prevent unauthorized transfers
  // User must sign message: "Transfer Sprout ${sproutId} to ${toWalletAddress}"

  // 3. Transfer NFT on-chain
  const txHash = await aptosService.transferNFT(
    sprout.user.walletAddress,
    toWalletAddress,
    sprout.tokenId
  );

  // 4. Find or create recipient user
  let recipientUser = await prisma.user.findUnique({
    where: { walletAddress: toWalletAddress }
  });

  if (!recipientUser) {
    // Create placeholder user for this wallet
    recipientUser = await prisma.user.create({
      data: {
        walletAddress: toWalletAddress,
        name: 'New Trainer',
        // ... defaults
      }
    });
  }

  // 5. Update database ownership
  await prisma.sprout.update({
    where: { id: sproutId },
    data: {
      userId: recipientUser.id,
      nftAddress: toWalletAddress
    }
  });

  // 6. Record transfer in history
  await prisma.sproutTransfer.create({
    data: {
      sproutId,
      fromUserId,
      toUserId: recipientUser.id,
      txHash,
      transferredAt: new Date()
    }
  });

  res.json({ success: true, txHash });
});
```

**D. On-Chain Transfer**
```typescript
// In aptosService.ts
async transferNFT(
  fromAddress: string,
  toAddress: string,
  tokenId: string
): Promise<string> {
  const transaction = await this.aptos.transaction.build.simple({
    sender: fromAddress,
    data: {
      function: `${MODULE_ADDRESS}::sprout_nft::transfer`,
      typeArguments: [],
      functionArguments: [toAddress, tokenId],
    },
  });

  // Sign and submit
  const committedTxn = await this.aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });

  return committedTxn.hash;
}
```

---

## Additional Improvements

### 9. Display APT Balance in Settings
Show user's APT balance next to coins/XP:

```dart
Row(
  children: [
    _buildCurrencyCard('Coins', '$userBalance', Icons.monetization_on, Colors.amber),
    _buildCurrencyCard('APT', '$aptBalance', Icons.currency_bitcoin, Colors.green),
    _buildCurrencyCard('XP', '1,250', Icons.star, Colors.yellow),
  ],
)
```

### 10. Transaction History
Add screen to view:
- Food purchases (points & APT)
- Sprout purchases
- Sprout transfers
- Strava rewards

---

## Testing Plan

### Phase 2 Testing:
- [ ] Test logout on iOS
- [ ] Test logout on Android
- [ ] Verify single-click logout works
- [ ] Test Petra wallet connection
- [ ] Test Pontem wallet connection
- [ ] Test signup flow for new users
- [ ] Test login flow for existing users

### Phase 3 Testing:
- [ ] Test APT payment for small package
- [ ] Test APT payment for medium package
- [ ] Test APT payment for large package
- [ ] Test payment verification (valid tx)
- [ ] Test payment verification (invalid tx)
- [ ] Test payment verification (wrong amount)
- [ ] Test payment verification (wrong recipient)

### Phase 4 Testing:
- [ ] Test common egg purchase with APT
- [ ] Test rare egg purchase with APT
- [ ] Verify NFT mints on-chain
- [ ] Verify egg appears in collection

### Phase 5 Testing:
- [ ] Test transfer to existing user
- [ ] Test transfer to new wallet
- [ ] Verify NFT ownership changes on-chain
- [ ] Verify database ownership updates
- [ ] Test transfer history display

---

## Environment Variables Needed

Add to `.env`:
```
# Treasury wallet for receiving payments
TREASURY_WALLET_ADDRESS=0x...
TREASURY_WALLET_PRIVATE_KEY=0x...

# Aptos Network
APTOS_NETWORK=testnet
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1

# Module addresses
SPROUT_NFT_MODULE_ADDRESS=0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e
```

---

## Priority Order

1. **Fix double logout** (quick win)
2. **Add native Aptos wallet connection** (enables existing users)
3. **Add APT food payments** (monetization)
4. **Add signup/login distinction** (UX improvement)
5. **Add Sprout purchases** (additional revenue)
6. **Add transfer system** (advanced feature)

---

## Notes

- **ngrok + backend**: Yes, you need BOTH terminals:
  - Terminal 1: `npm run dev` (runs backend on localhost:3000)
  - Terminal 2: `ngrok http 3000` (exposes to internet for mobile app)
  - Update `app_constants.dart` with ngrok URL after each restart

- **Legacy accounts**: The account without Sprouts likely existed before the auto-mint system. Solution:
  - Add check in collection screen: if `sproutsCount === 0 && !hasEgg`, navigate to "Get Free Sprout" flow
  - Or: Add backend endpoint to manually mint starter egg for existing users

- **Blockchain is working**: The Aptos view function error was just a warning - NFTs are minting successfully!
