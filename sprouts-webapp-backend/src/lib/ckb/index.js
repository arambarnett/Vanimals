const ckbSdkUtils = require("@nervosnetwork/ckb-sdk-utils");
const EC = require("elliptic").ec;
const { getBalanceByLock, getLiveCellsByLock } = require("./cells");
const { shannonToCKB } = require("./math");

module.exports = async ({
  CKB: { PREFIX, INDEXER_URL, ISSUER_TYPE_SCRIPT },
}) => {
  const getShortAddressFromPrivateKey =
    (privateKey) => ckbSdkUtils.privateKeyToAddress(privateKey, { prefix: PREFIX });

  const generatePrivateKey = () => {
    const ec = new EC("secp256k1");
    const key = ec.genKeyPair();
    return "0x" + key.getPrivate("hex");
  };

  const addressToScript = (address) => ckbSdkUtils.addressToScript(address);
  const scriptToHash = (mintedCell) => ckbSdkUtils.scriptToHash(mintedCell).slice(2, 22);

  return {
    generateAddressAndPK: () => {
      const privateKey = generatePrivateKey();
      const address = getShortAddressFromPrivateKey(privateKey);
      return { privateKey, address };
    },
    getBalance: async (address) => {
      const lock = addressToScript(address);
      const balance = await getBalanceByLock(INDEXER_URL, lock);
      return shannonToCKB(balance);
    },
    getAllNftsByAdress: async (userNervosAdress) => {
      const userLockScript = addressToScript(userNervosAdress);

      const issuerTypeId = scriptToHash(ISSUER_TYPE_SCRIPT).slice(2, 22);

      // TODO: Add pagination
      // Get all user's live cells
      const userLivecells = await getLiveCellsByLock({ indexerUrl: INDEXER_URL, lockScript: userLockScript });
      // filter the ones that belong to our Issuer
      const userNftsCells = userLivecells.cells.filter((cell) => (cell.type.args.slice(2, 22) === issuerTypeId));

      return userNftsCells;
    },
  };
};
