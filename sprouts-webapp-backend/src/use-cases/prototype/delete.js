module.exports = ({
  database: { models: { Prototype } },
}) => async (prototypeId) => {
  await Prototype.destroy({
    where: { id: prototypeId }
  });
};
