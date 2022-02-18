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

export const allStats = genData();
export default genData;
