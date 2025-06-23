module.exports = ({
  database: { models: { Prototype } },
}) => async ({ limit = 20, offset = 0 }) => {
  const prototypes = await Prototype.findAll({ limit, offset });
  return prototypes;
};
