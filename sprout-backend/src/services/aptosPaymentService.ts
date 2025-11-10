import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export class AptosPaymentService {
  private aptos: Aptos;
  private readonly TREASURY_WALLET = process.env.TREASURY_WALLET_ADDRESS || '';
  private readonly APT_TO_OCTAS = 100000000; // 1 APT = 100,000,000 Octas

  constructor() {
    const network = (process.env.APTOS_NETWORK as Network) || Network.TESTNET;
    const config = new AptosConfig({ network });
    this.aptos = new Aptos(config);
  }

  /**
   * Verify an APT payment transaction
   * Ensures the transaction:
   * - Exists and succeeded
   * - Was sent from the expected address
   * - Was sent to the treasury wallet
   * - Has the correct amount
   * - Was created recently (within last 10 minutes)
   */
  async verifyPayment(
    txHash: string,
    expectedAmount: number, // Amount in APT (e.g., 0.1)
    fromAddress: string
  ): Promise<{
    isValid: boolean;
    error?: string;
    txDetails?: any;
  }> {
    try {
      console.log('🔍 Verifying APT payment:', {
        txHash,
        expectedAmount,
        fromAddress,
        treasuryWallet: this.TREASURY_WALLET,
      });

      // Get transaction details
      const transaction = await this.aptos.getTransactionByHash({
        transactionHash: txHash,
      });

      if (!transaction) {
        return {
          isValid: false,
          error: 'Transaction not found',
        };
      }

      // Check if transaction succeeded
      if (!transaction.success) {
        return {
          isValid: false,
          error: 'Transaction failed on-chain',
        };
      }

      // Verify transaction is recent (within 10 minutes)
      const txTimestamp = Number(transaction.timestamp);
      const now = Date.now() * 1000; // Convert to microseconds
      const tenMinutesInMicroseconds = 10 * 60 * 1000000;

      if (now - txTimestamp > tenMinutesInMicroseconds) {
        return {
          isValid: false,
          error: 'Transaction too old (must be within 10 minutes)',
        };
      }

      // For coin transfer transactions, verify details
      if (transaction.type === 'user_transaction') {
        const payload = (transaction as any).payload;

        // Check if this is a coin transfer
        if (
          payload &&
          payload.function &&
          payload.function.includes('coin::transfer')
        ) {
          // Verify sender
          const sender = (transaction as any).sender;
          if (sender !== fromAddress) {
            return {
              isValid: false,
              error: `Sender mismatch: expected ${fromAddress}, got ${sender}`,
            };
          }

          // Verify recipient (treasury wallet)
          const recipient = payload.arguments?.[0];
          if (recipient !== this.TREASURY_WALLET) {
            return {
              isValid: false,
              error: `Recipient mismatch: expected ${this.TREASURY_WALLET}, got ${recipient}`,
            };
          }

          // Verify amount
          const amountInOctas = Number(payload.arguments?.[1]);
          const expectedOctas = Math.floor(expectedAmount * this.APT_TO_OCTAS);

          // Allow 1% tolerance for rounding
          const tolerance = expectedOctas * 0.01;
          if (
            Math.abs(amountInOctas - expectedOctas) > tolerance
          ) {
            return {
              isValid: false,
              error: `Amount mismatch: expected ${expectedOctas} octas (${expectedAmount} APT), got ${amountInOctas} octas`,
            };
          }

          console.log('✅ Payment verified:', {
            txHash,
            sender,
            recipient,
            amountAPT: amountInOctas / this.APT_TO_OCTAS,
            timestamp: new Date(txTimestamp / 1000).toISOString(),
          });

          return {
            isValid: true,
            txDetails: {
              txHash,
              sender,
              recipient,
              amountAPT: amountInOctas / this.APT_TO_OCTAS,
              amountOctas: amountInOctas,
              timestamp: new Date(txTimestamp / 1000).toISOString(),
            },
          };
        } else {
          return {
            isValid: false,
            error: 'Transaction is not a coin transfer',
          };
        }
      } else {
        return {
          isValid: false,
          error: `Invalid transaction type: ${transaction.type}`,
        };
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        isValid: false,
        error: `Verification failed: ${error}`,
      };
    }
  }

  /**
   * Get wallet's APT balance
   */
  async getBalance(walletAddress: string): Promise<number> {
    try {
      // Get account resource for AptosCoin
      const resources = await this.aptos.getAccountResources({
        accountAddress: walletAddress,
      });

      const coinResource = resources.find(
        (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );

      if (!coinResource) {
        return 0;
      }

      const balance = Number((coinResource.data as any).coin.value);
      return balance / this.APT_TO_OCTAS; // Convert octas to APT
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  /**
   * Check if transaction hash already used (prevent replay attacks)
   */
  async isTransactionUsed(txHash: string, prisma: any): Promise<boolean> {
    const existingTx = await prisma.foodTransaction.findFirst({
      where: { txHash },
    });

    return existingTx !== null;
  }
}
