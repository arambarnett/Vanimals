module.exports = ({
  database: { models: { Stat } },
}) => async (assetId) => {
  await Stat.destroy({
    where: { id: assetId }
  });
};
