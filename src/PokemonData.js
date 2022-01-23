import allData from './allGens.json';

function genData(genList) {
  let requiredData = {};
  for (const gen of genList) {
    requiredData = { ...requiredData, ...allData[gen] };
  }
  return requiredData;
}

export default genData;
