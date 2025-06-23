module.exports = ({
  database: { models: { Item } },
}) => async (itemId) => {
  await Item.destroy({
    where: { id: itemId }
  });
};
