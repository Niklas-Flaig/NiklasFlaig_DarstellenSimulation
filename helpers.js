function map(value, minStart, maxStart, minGoal, maxGoal) {
  return (value - minStart) / (maxStart - minStart) * (maxGoal - minGoal) + minGoal;
}

function getColor(value, min, max) {
  return chroma.mix(colors[0], colors[1], map(value, min, max, 0, 1), "lch");
  // if (value <= 0.5) return chroma.mix(colors[0], colors[1], map(value, min, max, 0, 0.5), "lch");
  // if (value > 0.5) return chroma.mix(colors[1], colors[2], map(value, min, max, 0.5, 1), "lch");
}

// will find the biggest value of a key in data
function getMaxValue (key, dataSet) {
  let maxValue = 0;
  // check forEach country if it holds a higher value than the current one
  dataSet.forEach(country => {
    // if the new value is bigger, than the current maxValue, overwrite
    if (country[key] > maxValue) {
      maxValue = country[key];
      // console.log(country.countryName + "     " + country[key]);
    }
  });
  return maxValue;
};

// will find the smallest value of a key in dataSet
function getMinValue (key, dataSet) {
  let minValue = dataSet[0][key];
  // check forEach country if it holds a lower value than the current one
  dataSet.forEach(country => {
    // if the new value is lower, than the current minValue, overwrite
    if (country[key] < minValue) {
      minValue = country[key];
    }
  });
  return minValue;
};

function sortFor(key, descending = false) {
  let newData = [];
  

  if (!descending) {
    data.forEach(countryA => {
      let added = false;

      for (let x = 0; x < newData.length; x++) {
        const countryB = newData[x];

        if (countryA[key] < countryB[key]) {
          newData.splice(x, 0, countryA);
          added = true;
          break;
        }
      }
      
      if (added === false) newData.push(countryA);
    });
  } else {

    data.forEach(countryA => {
      let added = false;
      
      for (let x = 0; x < newData.length; x++) {
        const countryB = newData[x];
        
        if (countryA[key] > countryB[key]) {
          newData.splice(x, 0, countryA);
          added = true;
          break;
        }
      }
      if (added === false) newData.push(countryA);
    });
  }

  return newData;
}

/*
  this funciton determines the values to move the map
  so it is centered
*/
function centerMap(maxRadius) {
  let right = stage.innerWidth() / 2;
  let left = stage.innerWidth() / 2;
  let up = stage.innerHeight() / 2;
  let down = stage.innerHeight() / 2;

  data.forEach(country => {
    const thisRadius = map(country.population, 0, maxPopulation, 0, maxRadius);
    
    let currentLeft = map(country.longitude + 180, 0, 360, 0, stage.innerWidth()) - thisRadius;
    if (currentLeft < left) left = currentLeft;

    let currentRight = map(country.longitude + 180, 0, 360, 0, stage.innerWidth()) + thisRadius;
    if (currentRight > right) right = currentRight;

    let currentUp = map(country.latitude + 180, 0, 360, stage.innerHeight(), 0) - thisRadius;
    if (currentUp < up) up = currentUp;

    let currentDown = map(country.latitude + 180, 0, 360, stage.innerHeight(), 0) + thisRadius;
    if (currentDown > down) down = currentDown;
  });

  // add this value to the xPosition of all countrys, to center the map (in xDirection)
  let moveStageInX = (stage.innerWidth() - right - left) / 2;
  // add this value to the yPosition of all countrys, to center the map (in yDirection)
  let moveStageInY = (stage.innerHeight() - down - up) / 2;

  return {
    x: moveStageInX,
    y: moveStageInY
  };
}


// rangeStart and -End are percent-values
// please give two values (first val smaller than the second)
function filterData(key, rangeStart = 0, rangeEnd = 100) {
  const keyStart = getMinValue("population", dataNoEdit);
  const keyEnd = getMaxValue("population", dataNoEdit);

  // rangestart = 0 means: lowerValue = smallest possible Value
  const lowerValue = map(rangeStart, 0, 100, keyStart, keyEnd);
  // rangeEnd = 100
  const upperValue = map(rangeEnd, 0, 100, keyStart, keyEnd);

  let newData = createWorkData();
  
  for (let a = 0; a < newData.length; a++) {
    const country = newData[a];
    // if a countrys keyvalue doesn't match the range
    if (country[key] < lowerValue || country[key] > upperValue) {
      // deleete the var
      newData.splice(a, 1);
    }
  }
  return newData;
}
