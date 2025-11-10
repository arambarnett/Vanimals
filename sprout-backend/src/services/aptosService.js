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
exports.AptosService = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
class AptosService {
    constructor() {
        const network = process.env.APTOS_NETWORK || ts_sdk_1.Network.TESTNET;
        const config = new ts_sdk_1.AptosConfig({ network });
        this.aptos = new ts_sdk_1.Aptos(config);
        this.moduleAddress = process.env.APTOS_MODULE_ADDRESS || "";
        // Admin account for minting and updating NFTs
        const privateKeyHex = process.env.APTOS_ADMIN_PRIVATE_KEY || "";
        this.adminAccount = ts_sdk_1.Account.fromPrivateKey({
            privateKey: new ts_sdk_1.Ed25519PrivateKey(privateKeyHex)
        });
        console.log(`Aptos Service initialized on ${network}`);
        console.log(`Module address: ${this.moduleAddress}`);
        console.log(`Admin address: ${this.adminAccount.accountAddress.toString()}`);
    }
    /**
     * Mint a new Sprout NFT to a user's wallet
     */
    mintSproutNFT(userAddress, sproutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.aptos.transaction.build.simple({
                    sender: this.adminAccount.accountAddress,
                    data: {
                        function: `${this.moduleAddress}::sprout_nft::mint_sprout`,
                        functionArguments: [
                            userAddress,
                            sproutData.name,
                            sproutData.species,
                            sproutData.rarity,
                            sproutData.uri,
                        ],
                    },
                });
                const committedTxn = yield this.aptos.signAndSubmitTransaction({
                    signer: this.adminAccount,
                    transaction,
                });
                yield this.aptos.waitForTransaction({
                    transactionHash: committedTxn.hash,
                    options: {
                        timeoutSecs: 30,
                    }
                });
                console.log(`✅ Minted Sprout NFT: ${committedTxn.hash}`);
                return committedTxn.hash;
            }
            catch (error) {
                console.error('Error minting Sprout NFT:', error);
                throw error;
            }
        });
    }
    /**
     * Update Sprout stats based on goal completion or time decay
     */
    updateSproutStats(tokenAddress, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.aptos.transaction.build.simple({
                    sender: this.adminAccount.accountAddress,
                    data: {
                        function: `${this.moduleAddress}::sprout_nft::update_sprout_stats`,
                        functionArguments: [
                            tokenAddress,
                            updates.experienceGain,
                            updates.healthChange,
                            updates.hungerChange,
                        ],
                    },
                });
                const committedTxn = yield this.aptos.signAndSubmitTransaction({
                    signer: this.adminAccount,
                    transaction,
                });
                yield this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
                console.log(`✅ Updated Sprout stats: ${committedTxn.hash}`);
                return committedTxn.hash;
            }
            catch (error) {
                console.error('Error updating Sprout stats:', error);
                throw error;
            }
        });
    }
    /**
     * Feed a Sprout (restore hunger when user completes goal)
     */
    feedSprout(tokenAddress, nutritionValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.aptos.transaction.build.simple({
                    sender: this.adminAccount.accountAddress,
                    data: {
                        function: `${this.moduleAddress}::sprout_nft::feed_sprout`,
                        functionArguments: [tokenAddress, nutritionValue],
                    },
                });
                const committedTxn = yield this.aptos.signAndSubmitTransaction({
                    signer: this.adminAccount,
                    transaction,
                });
                yield this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
                console.log(`✅ Fed Sprout: ${committedTxn.hash}`);
                return committedTxn.hash;
            }
            catch (error) {
                console.error('Error feeding Sprout:', error);
                throw error;
            }
        });
    }
    /**
     * Get Sprout stats from on-chain data
     * NOTE: Simplified contract only stores species and rarity on-chain
     * Most stats are stored off-chain in database
     */
    getSproutStats(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Our simplified contract doesn't have get_sprout_stats
                // Return database stats instead
                console.warn('getSproutStats called - using database instead of on-chain data');
                return null;
            }
            catch (error) {
                console.error('Error getting Sprout stats:', error);
                return null;
            }
        });
    }
    /**
     * Get Sprout info (species, rarity)
     * NOTE: Contract returns (species, rarity) - grade is stored off-chain
     */
    getSproutInfo(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    function: `${this.moduleAddress}::sprout_nft::get_sprout_info`,
                    functionArguments: [tokenAddress],
                };
                const info = yield this.aptos.view({ payload });
                return {
                    species: String(info[0]),
                    rarity: String(info[1]),
                };
            }
            catch (error) {
                console.error('Error getting Sprout info:', error);
                return null;
            }
        });
    }
    /**
     * Record user activity on-chain
     */
    recordActivity(userAddress, activityData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.aptos.transaction.build.simple({
                    sender: this.adminAccount.accountAddress,
                    data: {
                        function: `${this.moduleAddress}::activity_tracker::record_activity`,
                        functionArguments: [
                            userAddress,
                            activityData.type,
                            activityData.pointsEarned,
                            activityData.experienceEarned,
                        ],
                    },
                });
                const committedTxn = yield this.aptos.signAndSubmitTransaction({
                    signer: this.adminAccount,
                    transaction,
                });
                yield this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
                console.log(`✅ Recorded activity on-chain: ${committedTxn.hash}`);
                return committedTxn.hash;
            }
            catch (error) {
                console.error('Error recording activity:', error);
                throw error;
            }
        });
    }
    /**
     * Get user activity stats from on-chain
     */
    getUserActivityStats(userAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    function: `${this.moduleAddress}::activity_tracker::get_user_stats`,
                    functionArguments: [userAddress],
                };
                const stats = yield this.aptos.view({ payload });
                return {
                    totalActivities: Number(stats[0]),
                    totalPoints: Number(stats[1]),
                    totalExperience: Number(stats[2]),
                    streakCount: Number(stats[3]),
                };
            }
            catch (error) {
                console.error('Error getting user activity stats:', error);
                return {
                    totalActivities: 0,
                    totalPoints: 0,
                    totalExperience: 0,
                    streakCount: 0,
                };
            }
        });
    }
    /**
     * Get user's wallet balance
     */
    getWalletBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resources = yield this.aptos.getAccountResources({
                    accountAddress: address,
                });
                const coinResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
                if (coinResource) {
                    const balance = coinResource.data.coin.value;
                    return parseInt(balance) / 100000000; // Convert from octas to APT
                }
                return 0;
            }
            catch (error) {
                console.error('Error getting wallet balance:', error);
                return 0;
            }
        });
    }
    /**
     * Verify that an address is a valid Aptos address
     */
    isValidAddress(address) {
        try {
            // Basic validation - Aptos addresses start with 0x and are hex
            return address.startsWith('0x') && address.length >= 3;
        }
        catch (_a) {
            return false;
        }
    }
}
exports.AptosService = AptosService;
