// ***************************************************************************************************
const mockupVanimals = [];

const m1 = {
  id: 2,
  name: "Chimpanzee",
  cellId: 2093765,
  gen: 0,
  skills: [
    { type: "Reproductive speed", value: 50 },
    { type: "Tenacity", value: 80 },
    { type: "Intelligence", value: 60 },
    { type: "Versatility", value: 80 },
    { type: "Size", value: 65 },
    { type: "Speed", value: 89 },
  ],
  hatchingDays: 4,
  status: "Near Threatened",
  lives: "Lives in the Rain Forest",
  inhabit: "Inhabits the Jungles",
  population: 55000,
  model: "components/3d/models/chimpanzee.glb",
  poster: "components/3d/posters/chimpanzee.png",
  scenary: "components/vr/chimpanzee.png"
};

const m2 = {
  id: 12,
  name: "Penguin",
  cellId: 205856,
  gen: 1,
  skills: [
    { type: "Reproductive speed", value: 43 },
    { type: "Tenacity", value: 32 },
    { type: "Intelligence", value: 54 },
    { type: "Versatility", value: 33 },
    { type: "Size", value: 11 },
    { type: "Speed", value: 87 },
  ],
  hatchingDays: 4,
  status: "a",
  lives: "b",
  inhabit: "c",
  population: 35000,
  model: "components/3d/models/penguin.glb",
  poster: "components/3d/posters/penguin.png",
  scenary: "components/vr/penguin.png"
};
const m3 = {
  id: 52,
  name: "Pigeon",
  cellId: 2093762,
  gen: 6,
  skills: [
    { type: "Reproductive speed", value: 350 },
    { type: "Tenacity", value: 280 },
    { type: "Intelligence", value: 160 },
    { type: "Versatility", value: 280 },
    { type: "Size", value: 5 },
    { type: "Speed", value: 89 },
  ],
  hatchingDays: 4,
  status: "r",
  lives: "s",
  inhabit: "t",
  population: 25000,
  model: "components/3d/models/pigeon.glb",
  poster: "components/3d/posters/pigeon.png",
  scenary: "components/vr/pigeon.png"
};

mockupVanimals.push(m1);
mockupVanimals.push(m2);
mockupVanimals.push(m3);
// **************************************************************************************************************************

const getAllVanimals = (dataFromNervos) => {
  const VanimalsData = dataFromNervos.map((vanimal) => {
    const data = {
      id: vanimal.id,
      name: vanimal.name,
      model: vanimal.model,
      poster: vanimal.poster,
      status: vanimal.status,
      lives: vanimal.lives,
      inhabit: vanimal.inhabit,
      population: vanimal.population,
    };

    return data;
  });

  return VanimalsData;
};

const getVanimalByName = (dataFromNervos, name) => {
  const Vanimal = dataFromNervos.filter((vanimal) => vanimal.name === name);
  let VanimalData;
  if (Vanimal.length > 0)
  {
    VanimalData = {
      id: Vanimal[0].id,
      name: Vanimal[0].name,
      cellId: Vanimal[0].cellId,
      gen: Vanimal[0].cellId,
      skills: Vanimal[0].cellId,
      hatchingDays: Vanimal[0].hatchingDays,
      status: Vanimal[0].status,
      lives: Vanimal[0].lives,
      inhabit: Vanimal[0].inhabit,
      population: Vanimal[0].population,
      model: Vanimal[0].model,
      poster: Vanimal[0].poster,
      scenary: Vanimal[0].scenary,
    };
  }
  return VanimalData;

};
module.exports = { getAllVanimals, getVanimalByName, mockupVanimals };
