import allData from './allGens.json';

function genData(genList) {
  let allGenList;
  if (genList === undefined) {
    allGenList = Object.keys(allData).map((gen) => parseInt(gen, 10));
  }
  let requiredData = {};
  (genList || allGenList).forEach((gen) => {
    requiredData = { ...requiredData, ...allData[gen] };
  });
  return requiredData;
}


export function isFullyEvolved(mon, pokemonData) {
  if (mon.evos === undefined) {
    return true;
  }
  const pokemonNames = Object.keys(pokemonData)
  for (const evolution of mon.evos) {
    if (pokemonNames.includes(evolution)) {
      return false;
    }
  }
  return true;
}

export const allStats = genData();
export default genData;
