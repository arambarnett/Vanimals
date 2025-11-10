import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, InputViewFunctionData } from "@aptos-labs/ts-sdk";

export class AptosService {
  private aptos: Aptos;
  private adminAccount: Account;
  private moduleAddress: string;

  constructor() {
    const network = (process.env.APTOS_NETWORK as Network) || Network.TESTNET;
    const config = new AptosConfig({ network });
    this.aptos = new Aptos(config);
    this.moduleAddress = process.env.APTOS_MODULE_ADDRESS || "";

    // Admin account for minting and updating NFTs
    const privateKeyHex = process.env.APTOS_ADMIN_PRIVATE_KEY || "";
    this.adminAccount = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(privateKeyHex)
    });

    console.log(`Aptos Service initialized on ${network}`);
    console.log(`Module address: ${this.moduleAddress}`);
    console.log(`Admin address: ${this.adminAccount.accountAddress.toString()}`);
  }

  /**
   * Mint a new Sprout NFT to a user's wallet
   */
  async mintSproutNFT(userAddress: string, sproutData: {
    name: string;
    species: string;
    rarity: string;
    uri: string;
  }): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
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

      const committedTxn = await this.aptos.signAndSubmitTransaction({
        signer: this.adminAccount,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: committedTxn.hash,
        options: {
          timeoutSecs: 30,
        }
      });

      console.log(`✅ Minted Sprout NFT: ${committedTxn.hash}`);
      return committedTxn.hash;
    } catch (error) {
      console.error('Error minting Sprout NFT:', error);
      throw error;
    }
  }

  /**
   * Update Sprout stats based on goal completion or time decay
   */
  async updateSproutStats(tokenAddress: string, updates: {
    experienceGain: number;
    healthChange: number;
    hungerChange: number;
  }): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
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

      const committedTxn = await this.aptos.signAndSubmitTransaction({
        signer: this.adminAccount,
        transaction,
      });

      await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });

      console.log(`✅ Updated Sprout stats: ${committedTxn.hash}`);
      return committedTxn.hash;
    } catch (error) {
      console.error('Error updating Sprout stats:', error);
      throw error;
    }
  }

  /**
   * Feed a Sprout (restore hunger when user completes goal)
   */
  async feedSprout(tokenAddress: string, nutritionValue: number): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: this.adminAccount.accountAddress,
        data: {
          function: `${this.moduleAddress}::sprout_nft::feed_sprout`,
          functionArguments: [tokenAddress, nutritionValue],
        },
      });

      const committedTxn = await this.aptos.signAndSubmitTransaction({
        signer: this.adminAccount,
        transaction,
      });

      await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });

      console.log(`✅ Fed Sprout: ${committedTxn.hash}`);
      return committedTxn.hash;
    } catch (error) {
      console.error('Error feeding Sprout:', error);
      throw error;
    }
  }

  /**
   * Get Sprout stats from on-chain data
   * NOTE: Simplified contract only stores species and rarity on-chain
   * Most stats are stored off-chain in database
   */
  async getSproutStats(tokenAddress: string) {
    try {
      // Our simplified contract doesn't have get_sprout_stats
      // Return database stats instead
      console.warn('getSproutStats called - using database instead of on-chain data');
      return null;
    } catch (error) {
      console.error('Error getting Sprout stats:', error);
      return null;
    }
  }

  /**
   * Get Sprout info (species, rarity)
   * NOTE: Contract returns (species, rarity) - grade is stored off-chain
   */
  async getSproutInfo(tokenAddress: string) {
    try {
      const payload: InputViewFunctionData = {
        function: `${this.moduleAddress}::sprout_nft::get_sprout_info`,
        functionArguments: [tokenAddress],
      };

      const info = await this.aptos.view({ payload });

      return {
        species: String(info[0]),
        rarity: String(info[1]),
      };
    } catch (error) {
      console.error('Error getting Sprout info:', error);
      return null;
    }
  }

  /**
   * Record user activity on-chain
   */
  async recordActivity(userAddress: string, activityData: {
    type: string;
    pointsEarned: number;
    experienceEarned: number;
  }): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
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

      const committedTxn = await this.aptos.signAndSubmitTransaction({
        signer: this.adminAccount,
        transaction,
      });

      await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });

      console.log(`✅ Recorded activity on-chain: ${committedTxn.hash}`);
      return committedTxn.hash;
    } catch (error) {
      console.error('Error recording activity:', error);
      throw error;
    }
  }

  /**
   * Get user activity stats from on-chain
   */
  async getUserActivityStats(userAddress: string) {
    try {
      const payload: InputViewFunctionData = {
        function: `${this.moduleAddress}::activity_tracker::get_user_stats`,
        functionArguments: [userAddress],
      };

      const stats = await this.aptos.view({ payload });

      return {
        totalActivities: Number(stats[0]),
        totalPoints: Number(stats[1]),
        totalExperience: Number(stats[2]),
        streakCount: Number(stats[3]),
      };
    } catch (error) {
      console.error('Error getting user activity stats:', error);
      return {
        totalActivities: 0,
        totalPoints: 0,
        totalExperience: 0,
        streakCount: 0,
      };
    }
  }

  /**
   * Get user's wallet balance
   */
  async getWalletBalance(address: string): Promise<number> {
    try {
      const resources = await this.aptos.getAccountResources({
        accountAddress: address,
      });

      const coinResource = resources.find(
        (r: any) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );

      if (coinResource) {
        const balance = (coinResource.data as any).coin.value;
        return parseInt(balance) / 100000000; // Convert from octas to APT
      }

      return 0;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  }

  /**
   * Verify that an address is a valid Aptos address
   */
  isValidAddress(address: string): boolean {
    try {
      // Basic validation - Aptos addresses start with 0x and are hex
      return address.startsWith('0x') && address.length >= 3;
    } catch {
      return false;
    }
  }
}
