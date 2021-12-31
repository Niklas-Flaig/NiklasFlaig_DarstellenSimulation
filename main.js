let stage = $("#canvas");
// const label = $("#mouseover-label");

const colors = ["#BE5050", "#E3E04B"];
let data = createWorkData();

// get the relevant maxValues
const maxPopulation = getMaxValue("population");
const minPopulation = getMinValue("population");

const maxHappynesScore = getMaxValue("happynesScore");
const minHappynesScore = getMinValue("happynesScore");

const maxSuicideRate = getMaxValue("suicideRate");
const minSuicideRate = getMinValue("suicideRate");


$(function () {
  atheisticState();
  // drawRainState(true);
  // drawMapState();
});
// window.addEventListener('resize', drawRainState);

function drawMapState(autoArea = true) {
  
  // the area displays the population-size
  let maxArea = 1000;
  if (autoArea === true) maxArea = determinAutoArea();
  
  data.forEach(country => {
    // the dots positon on the stage is the raw 
    // 1. shift position to positiv values; 2. scale the value to a the stagesSize
    const xPosition = map(country.longitude + 180, 0, 360, 0, stage.innerWidth());
    const yPosition = map(country.latitude + 90, 0, 180, stage.innerHeight(), 0);

    const area = map(country.population, 0, maxPopulation, 0, maxArea);
    const radius = Math.sqrt(area / Math.PI);

    // the color displays the happynesScore
    const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);

    // create the div and 
    let countryElement = $(`<div id="${country.countryName}"></div>`);
    countryElement.addClass("country");
    countryElement.css({
      width: radius * 2,
      height: radius * 2,
      left: xPosition - radius,
      top: yPosition - radius,
      "background-color": color,
    });

    stage.append(countryElement);

  });

  //     countryCircle.data(data[i]);

    //     countryCircle.mouseover(function () {
    //         countryCircle.addClass("highlight");
    //         label.text(countryCircle.data().countryName);
    //     });

    //     countryCircle.mouseout(function () {
    //        // countryCircle.removeClass("highlight");
    //         countryCircle.addClass("no-highlight-anymore");
    //     });

    //     stage.append(countryCircle);
    // }
}


function determinAutoArea(key = "population", padding = 0) {
  const largestValueForKey = data.getMaxValue(key);
  
  // the biggest size the Area can get
  let maxRadius = 100000;

  for (let a = 0; a < data.length; a++) {
    const countryA = data[a];
    let maxPossibleRadiusForA = maxRadius;
    
    const yPosA = map(countryA.longitude + 180, 0, 360, 0, stage.innerWidth());
    const xPosA = map(countryA.latitude + 90, 0, 180, stage.innerHeight(), 0);
    
    // only has to check against all countrys coming after
    for (let b = a + 1; b < data.length; b++) {
      const countryB = data[b];

      const yPosB = map(countryB.longitude + 180, 0, 360, 0, stage.innerWidth());
      const xPosB = map(countryB.latitude + 90, 0, 180, stage.innerHeight(), 0);

      const distanceAB = Math.sqrt(Math.pow(yPosA - yPosB, 2) + Math.pow(xPosA - xPosB, 2));
      // compare maxPossibleRadiusOnAForThisCombi against currently maxPossibleRadiusForA
      let maxPossibleRadiusOnAForThisCombi = (distanceAB - padding) * ((countryA[key] + countryB[key]) / countryA[key]);
      if (maxPossibleRadiusOnAForThisCombi < maxPossibleRadiusForA) maxPossibleRadiusForA = maxPossibleRadiusOnAForThisCombi;
    }
    
    // compare final maxPossibleRadiusForA against current maxRadius
    let maxRadiusNeededToFitA = (maxPossibleRadiusForA / countryA[key]) * largestValueForKey;
    if (maxRadiusNeededToFitA < maxRadius) maxRadius = maxRadiusNeededToFitA;
  }

  return (Math.PI * Math.pow(maxRadius, 2));
}



function drawRainState(inSteps = false) {
  if (!inSteps) {
    data.forEach(country => {
      // the dots positon on the stage is the raw 
      // 1. shift position to positiv values; 2. scale the value to a the stagesSize
      const xPosition = map(country.happynesScore, minHappynesScore, maxHappynesScore, 0 + 20, stage.innerWidth() - 20);
      
      // the color displays the happynesScore
      const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);
  
      // create the div and 
      let countryElement = $(`<div id="${country.countryName}"></div>`);
      countryElement.addClass("rainCountry");
      countryElement.css({
        width: 1,
        height: 5,
        left: xPosition,
        top: 100,
        "background-color": color,
      });
  
      stage.append(countryElement);
  
    });
  }

  
  if (inSteps) {
    
    data = sortFor("happynesScore");

    const padding = 20;

    const xMax = stage.innerWidth();

    for (let a = 0; a < data.length; a++) {
      // the color displays the happynesScore
      const country = data[a];

      const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);

      // create the div
      let countryElement = $(`<div id="${country.countryName}"></div>`);
      countryElement.addClass("rainCountry");
      countryElement.css({
        width: 8,
        height: 8,
        left: ((xMax - 2 * padding) / data.length * a) + padding,
        top: 100,
        "background-color": color,
      });
  
      stage.append(countryElement);

      const dropTime = map(country.suicideRate, minSuicideRate, maxSuicideRate, 10000, 1000);

      setTimeout(() => { // this first timeout makes it appear, as if the rain is just starting: very cool
        newRainDrop({x: ((xMax - 2 * padding) / data.length * a) + padding, y: 100}, dropTime);
      }, dropTime);
      
    }
  }
}


function newRainDrop(startPos, dropTime) {

  setTimeout(() => {
    newRainDrop({x: startPos.x, y: startPos.y}, dropTime);
  }, dropTime);
  
  let rainDrop = $(`<div></div>`);
  
  rainDrop.addClass("rainDrop");
  
  rainDrop.css({
    width: 4,
    height: 2,
    left: startPos.x,
    top: startPos.y,
    "background-color": "black",
  });
  
  stage.append(rainDrop);

  window.requestAnimationFrame(dropRainDrop);
  
  
  let start, previousTimeStamp;
  
  function dropRainDrop(timestamp) {
    // init
    if (start === undefined) start = timestamp;
  
    // animation Progress
    const time = timestamp - start;
    
    // animation
    if (previousTimeStamp !== timestamp) {
      // speed = 0.6 // constant
      const speed = time * 0.001;
      
      rainDrop.css({
        top: startPos.y + Math.min(time * speed, stage.innerHeight() - 200), // 200 = maximal endPos,
        height: Math.round(2 + 12 * speed),
      });
    }

    // Repeat the animation as long as time is 
    if (time < 1050) {
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(dropRainDrop);
    } else { // if the animation is fullfilled delete the element
      rainDrop.remove();
    }
  }
}


function atheisticState(params) {
  const maxArea = 1000;
  data.forEach(country => {

    const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);

    let populationAtheistic = country.population * 0.01 * country.shareOfAtheisticOrUnaffiliated;
    // when the percentage is 1(smallest possible value) we don't want the div to be shown
    if (country.shareOfAtheisticOrUnaffiliated === 1) populationAtheistic = 0;

    let area = map(populationAtheistic, 0, maxPopulation, 0, maxArea);
    let radius = Math.sqrt(area / Math.PI);

    let elementLeft = $(`<div id="${country.countryName}_Left"></div>`);
    let elementRigt = $(`<div id="${country.countryName}_Rigt"></div>`);


    elementLeft.addClass("country");
    elementLeft.css({
      width: 2 * radius,
      height: 2 * radius,
      left: stage.innerWidth() * 0.3 - radius,
      top: map(country.happynesScore, minHappynesScore, maxHappynesScore, 0 + 20, stage.innerHeight() - 20) - radius,
      "background-color": color,
    });

    area = map(country.population - populationAtheistic, 0, maxPopulation, 0, maxArea);
    radius = Math.sqrt(area / Math.PI);

    elementRigt.addClass("country");
    elementRigt.css({
      width: 2 * radius,
      height: 2 * radius,
      left: stage.innerWidth() * 0.6 - radius,
      top: map(country.happynesScore, minHappynesScore, maxHappynesScore, 0 + 20, stage.innerHeight() - 20) - radius,
      "background-color": color,
    });

    stage.append(elementLeft);
    stage.append(elementRigt);
  });
}



function map(value, minStart, maxStart, minGoal, maxGoal) {
  return (value - minStart) / (maxStart - minStart) * (maxGoal - minGoal) + minGoal;
}

function getColor(value, min, max) {
  return chroma.mix(colors[0], colors[1], map(value, min, max, 0, 1), "lch");
}

// will find the biggest value of a key in data
function getMaxValue (key) {
  let maxValue = 0;
  // check forEach country if it holds a higher value than the current one
  data.forEach(country => {
    // if the new value is bigger, than the current maxValue, overwrite
    if (country[key] > maxValue) {
      maxValue = country[key];
      // console.log(country.countryName + "     " + country[key]);
    }
  });
  return maxValue;
};

// will find the smallest value of a key in data
function getMinValue (key) {
  let minValue = data[0][key];
  // check forEach country if it holds a lower value than the current one
  data.forEach(country => {
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