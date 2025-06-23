module.exports = ({
  database: { models: { PurchaseCkb } },
  ckb: { generateAddressAndPK },
}) => async ({
  itemPriceCkb,
  itemPrice,
  itemId,
  userId,
}) => {
  const { privateKey, address } = generateAddressAndPK();
  const purchaseCkb = await PurchaseCkb.create({
    addressPrivateKey: privateKey,
    depositAddress: address,
    itemPriceCkb,
    itemPrice,
    itemId,
    userId,
  });
  return purchaseCkb;
};
