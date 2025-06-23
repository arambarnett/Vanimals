module.exports = ({
  database: { models: { Instance, Prototype } },
}) => async ({ userId: ownerUserId, limit = 20, offset = 0, category = null }) => {
  const instances = await Instance.findAll({
    limit, offset,
    where: { ownerUserId },
    include: [{
      model: Prototype,
      ...(!!category && { where: { category } }),
    }],
    order: [["updatedAt", "DESC"]],
  });
  return instances;
};
