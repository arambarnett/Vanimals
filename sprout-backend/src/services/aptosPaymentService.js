"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosPaymentService = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
class AptosPaymentService {
    constructor() {
        this.TREASURY_WALLET = process.env.TREASURY_WALLET_ADDRESS || '';
        this.APT_TO_OCTAS = 100000000; // 1 APT = 100,000,000 Octas
        const network = process.env.APTOS_NETWORK || ts_sdk_1.Network.TESTNET;
        const config = new ts_sdk_1.AptosConfig({ network });
        this.aptos = new ts_sdk_1.Aptos(config);
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
    verifyPayment(txHash, expectedAmount, // Amount in APT (e.g., 0.1)
    fromAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('🔍 Verifying APT payment:', {
                    txHash,
                    expectedAmount,
                    fromAddress,
                    treasuryWallet: this.TREASURY_WALLET,
                });
                // Get transaction details
                const transaction = yield this.aptos.getTransactionByHash({
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
                    const payload = transaction.payload;
                    // Check if this is a coin transfer
                    if (payload &&
                        payload.function &&
                        payload.function.includes('coin::transfer')) {
                        // Verify sender
                        const sender = transaction.sender;
                        if (sender !== fromAddress) {
                            return {
                                isValid: false,
                                error: `Sender mismatch: expected ${fromAddress}, got ${sender}`,
                            };
                        }
                        // Verify recipient (treasury wallet)
                        const recipient = (_a = payload.arguments) === null || _a === void 0 ? void 0 : _a[0];
                        if (recipient !== this.TREASURY_WALLET) {
                            return {
                                isValid: false,
                                error: `Recipient mismatch: expected ${this.TREASURY_WALLET}, got ${recipient}`,
                            };
                        }
                        // Verify amount
                        const amountInOctas = Number((_b = payload.arguments) === null || _b === void 0 ? void 0 : _b[1]);
                        const expectedOctas = Math.floor(expectedAmount * this.APT_TO_OCTAS);
                        // Allow 1% tolerance for rounding
                        const tolerance = expectedOctas * 0.01;
                        if (Math.abs(amountInOctas - expectedOctas) > tolerance) {
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
                    }
                    else {
                        return {
                            isValid: false,
                            error: 'Transaction is not a coin transfer',
                        };
                    }
                }
                else {
                    return {
                        isValid: false,
                        error: `Invalid transaction type: ${transaction.type}`,
                    };
                }
            }
            catch (error) {
                console.error('Error verifying payment:', error);
                return {
                    isValid: false,
                    error: `Verification failed: ${error}`,
                };
            }
        });
    }
    /**
     * Get wallet's APT balance
     */
    getBalance(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get account resource for AptosCoin
                const resources = yield this.aptos.getAccountResources({
                    accountAddress: walletAddress,
                });
                const coinResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
                if (!coinResource) {
                    return 0;
                }
                const balance = Number(coinResource.data.coin.value);
                return balance / this.APT_TO_OCTAS; // Convert octas to APT
            }
            catch (error) {
                console.error('Error fetching balance:', error);
                return 0;
            }
        });
    }
    /**
     * Check if transaction hash already used (prevent replay attacks)
     */
    isTransactionUsed(txHash, prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTx = yield prisma.foodTransaction.findFirst({
                where: { txHash },
            });
            return existingTx !== null;
        });
    }
}
exports.AptosPaymentService = AptosPaymentService;
