import allData from "./allGens.json";

function genData(genList) {
  let requiredData = {};
  genList.forEach((gen) => {
    requiredData = { ...requiredData, ...allData[gen] };
  });
  return requiredData;
}

export default genData;
