const { ITEM_FILTERS } = require("../../constants");

module.exports = ({
  database: { models: { Item, Prototype } },
}) => async ({ limit = 20, offset = 0, where = null, category = null, filter = null }) => {
  
  // TODO implemenet filers
  switch (filter) {
  case ITEM_FILTERS.TRENDING:
    limit = 5, offset = 0;
    break;
  case ITEM_FILTERS.NEW_RELEASES:
    limit = 4, offset = 1;
    break;
  case ITEM_FILTERS.BEST_SELLERS:
    limit = 4, offset = 5;
    break;
  case ITEM_FILTERS.POPULAR:
    limit = 4, offset = 9;
    break;
  default:
    break;
  }

  const items = await Item.findAll({
    limit, offset,
    where,
    include: [{
      model: Prototype,
      ...(!!category && { where: { category } }),
    }],
    order: [["updatedAt", "DESC"]],
  });
  return items;
};
