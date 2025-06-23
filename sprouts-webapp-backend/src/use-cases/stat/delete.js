module.exports = ({
  database: { models: { Stat } },
}) => async (statId) => {
  await Stat.destroy({
    where: { id: statId }
  });
};
