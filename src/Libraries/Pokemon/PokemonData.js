import allData from './allGens.json';

function genData(genList) {
  if (genList == undefined ) {
    genList = Object.keys(allData).map((gen) => parseInt(gen, 10))
    console.log(genList)
  }
  let requiredData = {};
  genList.forEach((gen) => {
    requiredData = { ...requiredData, ...allData[gen] };
  });
  return requiredData;
}

export const allStats = genData()
export default genData;
