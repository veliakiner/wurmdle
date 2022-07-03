import Fuse from 'fuse.js';
import genData, { isFullyEvolved } from './PokemonData';

export function getGenRange(upperAndLower) {
  const [minGen, maxGen] = upperAndLower;
  const gens = [];
  for (let i = minGen; i <= maxGen; i += 1) {
    gens.push(i);
  }
  return gens;
}

export function getMonsList(genRange, onlyFullyEvolved) {
  console.log('Getting list for gens ', genRange);
  const gens = getGenRange(genRange);
  const stats = genData(gens); // can just filter stats by gens or something
  if (onlyFullyEvolved) {
    const fullyEvoStats = {};
    const pokemonNames = Object.keys(stats);
    pokemonNames.forEach((mon) => {
      if (isFullyEvolved(stats[mon], stats)) {
        fullyEvoStats[mon] = stats;
      }
    });
    return Object.keys(fullyEvoStats);
  }
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

export function calcGuesses(monsList) {
  /* Scale number of guesses according to how many mons are in the guess pool. */
  return Math.round(Math.log(monsList.length) / Math.log(2)) - 2;
}
