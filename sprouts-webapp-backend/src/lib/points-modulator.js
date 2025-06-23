const { GAME: { MAX_N00_POINTS } } = require("../constants");

const calculatePoints = ({ randomMultipliers, stats }) => {
  const N = stats.length;
  const m = randomMultipliers.split(",").map((n) => parseInt(n));
  const tau = 200 * 10 ** 6;
  
  let attack = 0, life = 0, defense = 0, i = 0;
  if (N > 0) {
    const weigth = m.slice(0, N).reduce((a, b) => a + b);
    for (const stat of stats) {
      attack += m[i] * (1 - Math.exp(-stat.value / tau)) / weigth;
      defense += m[i] * (1 - Math.exp(-stat.value / tau)) / weigth;
      life += m[i] * (1 - Math.exp(-stat.value / tau)) / weigth;
      ++i;
    }
  }

  return [
    {
      type: "LIFE_POINTS",
      value: Math.trunc(life * 30 + 70) * MAX_N00_POINTS,
    },
    {
      type: "ATTACK_POINTS",
      value: Math.trunc(attack * 20 + 80) * MAX_N00_POINTS,
    },
    {
      type: "DEFENSE_POINTS",
      value: Math.trunc(defense * 35 + 65) * MAX_N00_POINTS,
    },
  ];
};

module.exports = calculatePoints;
