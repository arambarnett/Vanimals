import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode, Transaction } from 'plaid';

export class PlaidService {
  private client: PlaidApi;

  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
          'PLAID-SECRET': process.env.PLAID_SECRET!,
        },
      },
    });

    this.client = new PlaidApi(configuration);
    console.log(`Plaid Service initialized in ${process.env.PLAID_ENV || 'sandbox'} mode`);
  }

  /**
   * Create a Link token for Plaid Link initialization
   */
  async createLinkToken(userId: string, userName?: string): Promise<string> {
    try {
      const response = await this.client.linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: 'Sprouts',
        products: [Products.Transactions, Products.Auth],
        country_codes: [CountryCode.Us],
        language: 'en',
        webhook: process.env.PLAID_WEBHOOK_URL,
      });

      return response.data.link_token;
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      throw error;
    }
  }

  /**
   * Exchange public token for access token
   */
  async exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string }> {
    try {
      const response = await this.client.itemPublicTokenExchange({
        public_token: publicToken,
      });

      return {
        accessToken: response.data.access_token,
        itemId: response.data.item_id,
      };
    } catch (error) {
      console.error('Error exchanging Plaid public token:', error);
      throw error;
    }
  }

  /**
   * Get transactions for a given date range
   */
  async getTransactions(
    accessToken: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    try {
      const response = await this.client.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          count: 500,  // Max transactions to fetch
          offset: 0,
        },
      });

      return response.data.transactions;
    } catch (error) {
      console.error('Error fetching Plaid transactions:', error);
      throw error;
    }
  }

  /**
   * Get account balances
   */
  async getBalance(accessToken: string) {
    try {
      const response = await this.client.accountsBalanceGet({
        access_token: accessToken,
      });

      return response.data.accounts.map(account => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances.current,
        available: account.balances.available,
        currency: account.balances.iso_currency_code || 'USD',
      }));
    } catch (error) {
      console.error('Error fetching Plaid balance:', error);
      throw error;
    }
  }

  /**
   * Analyze transactions for savings patterns
   */
  analyzeSavingsFromTransactions(transactions: Transaction[]): {
    totalSavings: number;
    savingsTransactions: Transaction[];
    spendingTransactions: Transaction[];
    netChange: number;
  } {
    const savingsTransactions: Transaction[] = [];
    const spendingTransactions: Transaction[] = [];
    let totalSavings = 0;
    let totalSpending = 0;

    for (const txn of transactions) {
      if (txn.amount < 0) {
        // Negative amount = money in (income/deposit/savings)
        const savings = Math.abs(txn.amount);
        totalSavings += savings;
        savingsTransactions.push(txn);
      } else {
        // Positive amount = money out (spending)
        totalSpending += txn.amount;
        spendingTransactions.push(txn);
      }
    }

    return {
      totalSavings,
      savingsTransactions,
      spendingTransactions,
      netChange: totalSavings - totalSpending,
    };
  }

  /**
   * Analyze spending by category
   */
  analyzeSpendingByCategory(transactions: Transaction[]): Map<string, number> {
    const categorySpending = new Map<string, number>();

    for (const txn of transactions) {
      if (txn.amount > 0) {  // Only spending transactions
        const categories = txn.category || ['Uncategorized'];
        const mainCategory = categories[0];

        const current = categorySpending.get(mainCategory) || 0;
        categorySpending.set(mainCategory, current + txn.amount);
      }
    }

    return categorySpending;
  }

  /**
   * Check if user is on track for savings goal
   */
  calculateSavingsProgress(
    currentSavings: number,
    targetSavings: number,
    startDate: Date,
    endDate: Date
  ): {
    progressPercentage: number;
    isOnTrack: boolean;
    projectedTotal: number;
    daysRemaining: number;
  } {
    const now = new Date();
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = totalDays - daysPassed;

    const progressPercentage = (currentSavings / targetSavings) * 100;
    const expectedProgressPercentage = (daysPassed / totalDays) * 100;
    const isOnTrack = progressPercentage >= expectedProgressPercentage;

    // Project total based on current rate
    const dailyRate = currentSavings / daysPassed;
    const projectedTotal = dailyRate * totalDays;

    return {
      progressPercentage,
      isOnTrack,
      projectedTotal,
      daysRemaining,
    };
  }
}
