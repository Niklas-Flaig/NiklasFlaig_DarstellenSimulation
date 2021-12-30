const stage = $("#canvas");
// const label = $("#mouseover-label");

const colors = ["#BE5050", "#E3E04B"];
let data = createWorkData();


$(function () {
  drawRainState(true);
  // drawMapState();
});

function drawMapState() {
  // get the relevant maxValues
  const maxPopulation = data.getMaxValue("population");
  const minPopulation = data.getMinValue("population");

  // const maxArea = autoArea();

  // colors
  const maxHappynesScore = data.getMaxValue("happynesScore");
  const minHappynesScore = data.getMinValue("happynesScore");

  data.forEach(country => {
    // the dots positon on the stage is the raw 
    // 1. shift position to positiv values; 2. scale the value to a the stagesSize
    const xPosition = map(country.longitude + 180, 0, 360, 0, stage.innerWidth());
    const yPosition = map(country.latitude + 90, 0, 180, stage.innerHeight(), 0);

    // the area displays the population-size
    const area = map(country.population, 0, maxPopulation, 0, 500);
    
    const radius = Math.sqrt(area / Math.PI);

    // the color displays the happynesScore
    const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);

    // create the div and 
    let countryElement = $(`<div id="${country.alpha3Code}"></div>`);
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

    // for (let i = 0; i < data.length; i++) {
    //     let longitude = gmynd.map(data[i].longitude, -180, 180, 0, stageWidth);
    //     let latitude = gmynd.map(data[i].latitude, -90, 90, stageHeight, 0);
    //     const countryArea = gmynd.map(data[i].population, 1, maxPopulation, 30, 100);
    //     // const countryRadius = Math.sqrt(countryArea / Math.PI);
    //     const countryRadius = gmynd.circleRadius(countryArea);
    //     let countryCircle = $("<div></div>");
    //     countryCircle.addClass("circle");
    //     countryCircle.css({
    //         width: countryRadius * 2,
    //         height: countryRadius * 2,
    //         left: longitude - countryRadius,
    //         top: latitude - countryRadius
    //     });

    //     countryCircle.data(data[i]);

    //     countryCircle.mouseover(function () {
    //         countryCircle.addClass("highlight");
    //         label.text(countryCircle.data().countryName);
    //     });

    //     countryCircle.mouseout(function () {
    //         countryCircle.removeClass("highlight");
    //         // countryCircle.addClass("no-highlight-anymore");
    //     });

    //     stage.append(countryCircle);
    // }
}

function drawRainState(inSteps = false) {
  const maxHappynesScore = data.getMaxValue("happynesScore");
  const minHappynesScore = data.getMinValue("happynesScore");

  if (!inSteps) {
    data.forEach(country => {
      // the dots positon on the stage is the raw 
      // 1. shift position to positiv values; 2. scale the value to a the stagesSize
      const xPosition = map(country.happynesScore, minHappynesScore, maxHappynesScore, 0 + 20, stage.innerWidth() - 20);
      
      // the color displays the happynesScore
      const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);
  
      // create the div and 
      let countryElement = $(`<div id="${country.alpha3Code}"></div>`);
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
      let countryElement = $(`<div id="${country.alpha3Code}"></div>`);
      countryElement.addClass("rainCountry");
      countryElement.css({
        width: 8,
        height: 8,
        left: ((xMax - 2 * padding) / data.length * a) + padding,
        top: 100,
        "background-color": color,
      });
  
      stage.append(countryElement);

      newRainDrop({x: ((xMax - 2 * padding) / data.length * a) + padding, y: 100});
    }
  }
}


// newRainDrop({x: 100, y: 100});


function newRainDrop(startPos) {
  
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



function autoArea(key = "population", padding = 0) {
  let largestValueForKey = data.getMaxValue(key);
  
  // the biggest size the Area can get
  let maxRadius = 0;

  for (let a = 0; a < data.length; a++) {
    let maxNeededRadiusForA;
    const countryA = data[a];
    
    const yPosA = map(countryA.longitude + 180, 0, 360, 0, stage.innerWidth());
    const xPosA = map(countryA.latitude + 90, 0, 180, stage.innerHeight(), 0);
    
    // only has to check against all countrys coming after
    for (let b = a + 1; b < data.length; b++) {
      const countryB = data[b];

      const yPosB = map(countryB.longitude + 180, 0, 360, 0, stage.innerWidth());
      const xPosB = map(countryB.latitude + 90, 0, 180, stage.innerHeight(), 0);

      const distanceAB = Math.sqrt((yPosA - yPosB)^2 + (xPosA - xPosB)^2);
      // compare maxNeededRadiusOnAForThisCombi against currently maxNeededRadiusForA
      let maxNeededRadiusOnAForThisCombi = (distanceAB - padding) * ((countryA[key] + countryB[key]) / countryA[key]);
      if (maxNeededRadiusOnAForThisCombi > maxNeededRadiusForA) maxNeededRadiusForA = maxNeededRadiusOnAForThisCombi;
    }
    
    // compare final maxNeededRadiusForA against current maxRadius
    let maxRadiusNeededToFitA = (maxNeededRadiusForA / countryA[key]) * largestValueForKey;
    if (maxRadiusNeededToFitA > maxRadius) maxRadius = maxRadiusNeededToFitA;
  }

  // return maxArea
  return (Math.PI * maxRadius^2);
}


function map(value, minStart, maxStart, minGoal, maxGoal) {
  return (value - minStart) / (maxStart - minStart) * (maxGoal - minGoal) + minGoal;
}

function getColor(value, min, max) {
  return chroma.mix(colors[0], colors[1], map(value, min, max, 0, 1), "lch");
}

// will find the biggest value of a key in data
data.getMaxValue = (key) => {
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
data.getMinValue = (key) => {
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