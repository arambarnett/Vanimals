// *********************************************************************************************************************************

const generateCollection = (vanimalsToShow) => {
  const mockupCollection = [];

  for (let i = 0; i < vanimalsToShow ; i++)
  {
    const entropy = Number(Math.floor(Math.random() * 10000)).toString(16);
    const anio = Math.floor(Math.random() * 2) + 2018;
    const mes = Math.floor(Math.random() * 11);
    const dia = Math.floor(Math.random() * 30);
    const model1 = {
      cellId: 855,
      state: "vanimal",
      acquiredAt: new Date (anio, mes, dia),
      gen: 0,

      entropy: entropy,
    };
    mockupCollection.push(model1);

  }
  const eggState = ["egg", "ready", "hatching"];
  const timeToReadyInfo = ["4hs", "Ready to hatch", "in Proccess"];
  for (let i = 0; i < vanimalsToShow ; i++)
  {
    const anio = Math.floor(Math.random() * 2) + 2018;
    const mes = Math.floor(Math.random() * 11);
    const dia = Math.floor(Math.random() * 30);
    const valueEgg = Math.floor(Math.random() * 3);
    const model2 = {
      cellId: 855,
      state: eggState[valueEgg],
      acquiredAt: new Date (anio, mes, dia),
      gen: 0,
      timeToReady: timeToReadyInfo[valueEgg]
    };
    mockupCollection.push(model2);

  }

  return mockupCollection;
};

// ****************************************************************************************************************************
const blake = require("blakejs");

const breeds = ["penguin", "chimpanzee", "pigeon", "axolotl", "elephant", "tiger"];
const name = ["Emperor Penguin", "Chimpanzee", "NYC Pigeon", "Axolotl", "Sumatran Elephant", "Bengal Tiger"];
const mapVanimalTypeToAmountOfColors = {};
const probabilityVanimal = [11.55, 3.39, 20.90, 5.35, 21.26, 37.55];
const rangeVanimal = [probabilityVanimal[0]];
for (let i = 1;i < probabilityVanimal.length;i++)
{
  rangeVanimal.push(probabilityVanimal[i] + rangeVanimal[rangeVanimal.length - 1]);
}
mapVanimalTypeToAmountOfColors[breeds[0]] = 5;
mapVanimalTypeToAmountOfColors[breeds[1]] = 4;
mapVanimalTypeToAmountOfColors[breeds[2]] = 6;
mapVanimalTypeToAmountOfColors[breeds[3]] = 8;
mapVanimalTypeToAmountOfColors[breeds[4]] = 6;
mapVanimalTypeToAmountOfColors[breeds[5]] = 9;

const rarities = ["common", "uncommon", "rare", "super rare", "ultra rare", "secret rare"];

const mapVanimalTypeToRarity = {};

mapVanimalTypeToRarity[breeds[0]] = [29.55, 26.60, 23.72, 13.58, 3.59, 2.96];
mapVanimalTypeToRarity[breeds[1]] = [16.73, 9.29, 22.30, 16.73, 18.22, 16.73];
mapVanimalTypeToRarity[breeds[2]] = [28.65, 27.60, 23.44, 13.03, 4.42, 2.86];
mapVanimalTypeToRarity[breeds[3]] = [38.03, 31.34, 12.67, 7.88, 6.23, 3.85];
mapVanimalTypeToRarity[breeds[4]] = [27.6, 28.66, 21.23, 15.93, 3.82, 2.76];
mapVanimalTypeToRarity[breeds[5]] = [30.14, 26.21, 22.28, 15.73, 3.02, 2.62];

const mapVanimalTypeToZoom = {};

mapVanimalTypeToZoom[breeds[0]] = "60deg";
mapVanimalTypeToZoom[breeds[1]] = "40deg";
mapVanimalTypeToZoom[breeds[2]] = "40deg";
mapVanimalTypeToZoom[breeds[3]] = "55deg";
mapVanimalTypeToZoom[breeds[4]] = "40deg";
mapVanimalTypeToZoom[breeds[5]] = "40deg";

const getBreedByEntropy = (entropy) => {
  // Una funcion inventada para obtener breed a partir de entropy.
  const maxSize = Math.pow(16, entropy.length) - 1;
  const comparativeNumber = 100 * (parseInt(entropy, 16) / maxSize);
  let j = 0;
  let number = null;
  while (j < rangeVanimal.length && number === null)
  {
    if (comparativeNumber <= rangeVanimal[j]) number = j;
    j++;
  }
  return { name: name[number], breed: breeds[number] };

};
const getColorByEntropy = (entropy, index) => {
  // que haga la magia
  let input = entropy;
  let i = 0;
  while (i <= index)
  {
    input = blake.blake2bHex(input);
    i = i + 1;
  }
  const hexColor = "#" + input.substring(0, 6);
  return hexColor;
};

const getRarityByEntropy = (entropy, breed) => {
  const number = 100 * (parseInt (entropy.substr(0, 3), 16) / 4095);
  let rarity = null;
  const length = mapVanimalTypeToRarity[breed].length;
  let comparativeNumber = 0;
  let j = 0;
  while (j < length && rarity === null)
  {
    comparativeNumber = mapVanimalTypeToRarity[breed][j] + comparativeNumber;
    if (number <= comparativeNumber) rarity = rarities[j];
    j++;
  }
  return rarity;
};
const buildColorsForVanimal = (vanimalType, entropy) => {
  const colors = [];
  const amountOfColors = mapVanimalTypeToAmountOfColors[vanimalType];

  for (let i = 0; i < amountOfColors; i++) {
    colors.push(getColorByEntropy(entropy, i));
  }

  return colors;
};

const getData = (vanimals, options) => {
  let j = 0;
  let currentIndex;
  if (!options.offset) currentIndex = 0;
  else currentIndex = options.offset;
  let limit;
  if (!options.limit) limit = vanimals.length;
  else limit = options.limit;
  let vanimalFilter;
  if (options.type === "vanimal") vanimalFilter = vanimals.filter((vanimal) => vanimal.state === "vanimal");
  else if (options.type === "egg") vanimalFilter = vanimals.filter((vanimal) => vanimal.state !== "vanimal");
  else vanimalFilter = vanimals;

  const collections = [];
  while (j < limit && currentIndex < vanimalFilter.length)
  {
    const vanimal = vanimalFilter[currentIndex];
    const data = {
      cellId: vanimal.cellId,
      acquiredAt: vanimal.acquiredAt,
      gen: vanimal.gen,
      state: vanimal.state,
    };
    if (vanimal.state === "vanimal")
    {
      const { breed, name } = getBreedByEntropy(vanimal.entropy);
      data.rarity = getRarityByEntropy(vanimal.entropy, breed);
      data.breed = breed;
      data.name = name;
      data.colors = buildColorsForVanimal(breed, vanimal.entropy);
      data.zoom = mapVanimalTypeToZoom[breed];
    }
    else if (vanimal.state !== "vanimal")
    {
      data.timeToReady = vanimal.timeToReady;
    }
    collections.push(data);
    j++;
    currentIndex++;
  }

  return { data: collections, totalCount: vanimalFilter.length };
};
const getUserCollection = (data, userAddres) => {
  // Esto devolvera la collection de un usuario sabiendo su address
  const address = userAddres;
  return data[address];
};
module.exports = { getData, generateCollection, getUserCollection };
