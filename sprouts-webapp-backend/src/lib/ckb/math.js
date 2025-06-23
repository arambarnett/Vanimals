// TODO: accomplish decimal places or search directly something from a library
const shannonToCKB = (amount) => Number(amount / BigInt(1.0e8));

module.exports = {
  shannonToCKB,
};
