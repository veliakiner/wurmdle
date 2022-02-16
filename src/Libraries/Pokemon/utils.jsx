import Fuse from 'fuse.js';
import genData from './PokemonData';

export function getGenRange(upperAndLower) {
  const [minGen, maxGen] = upperAndLower;
  const gens = [];
  for (let i = minGen; i <= maxGen; i += 1) {
    gens.push(i);
  }
  return gens;
}

export function getMonsList(genRange) {
  console.log('Getting list for gens ', genRange);
  const gens = getGenRange(genRange);
  const stats = genData(gens); // can just filter stats by gens or something
  return Object.keys(stats);
}

export function monsFuse(monsList) {
  const options = {
    includeScore: true,
    minMatchCharLength: 2,
    threshold: 0.6,
  };
  return new Fuse(monsList, options);
}
