class BlockchainConstants {
  // Aptos Network Configuration
  static const String aptosNetwork = 'testnet';
  static const String aptosRpcUrl = 'https://fullnode.testnet.aptoslabs.com/v1';

  // Contract Address (deployed on testnet)
  static const String contractAddress = '0x52503f9537f9c995b1883cc5967b6cc104842954aee3c009dcd08022aa2cee1e';

  // Collection Info
  static const String collectionName = 'Sprouts Collection';

  // Explorer URLs
  static const String explorerBaseUrl = 'https://explorer.aptoslabs.com';

  static String getAccountUrl(String address) {
    return '$explorerBaseUrl/account/$address?network=$aptosNetwork';
  }

  static String getTransactionUrl(String txHash) {
    return '$explorerBaseUrl/txn/$txHash?network=$aptosNetwork';
  }

  static String getNftUrl(String nftAddress) {
    return '$explorerBaseUrl/account/$nftAddress?network=$aptosNetwork';
  }
}
