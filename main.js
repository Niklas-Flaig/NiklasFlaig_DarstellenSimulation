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
  // atheisticStateV2();
  drawRainState(true);
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
        left: ((xMax - 2 * padding) / data.length * a) + padding - 4, // -4 = width / 2
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
    left: startPos.x - 2,
    top: startPos.y,
    "background-color": "black",
  });
  stage.append(rainDrop);

  let rainDropShadow = $("<div></div>");
  rainDropShadow.addClass("rainDropShadow");
  rainDropShadow.css({
    width: 4,
    height: 2,
    left: startPos.x - 2,
    top: startPos.y,
    "background-color": "gray"
  });
  stage.append(rainDropShadow);

  let start, previousTimeStamp;


  window.requestAnimationFrame(dropRainDrop);
  
  
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

      rainDropShadow.css({
        height: Math.min(time * speed, stage.innerHeight() - 200),
        opacity: 100 / time
      });
    }

    // Repeat the animation as long as time is 
    if (time < 1050) {
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(dropRainDrop);
    } else if (1050 <= time && time <= 2000) { 
      rainDrop.remove();
      window.requestAnimationFrame(dropRainDrop);
    } else { // if the animation is fullfilled delete the element
      rainDropShadow.remove();
    }
  }
}


function atheisticStateV1(params) {
  const maxArea = 10000;
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
      top: map(country.happynesScore, minHappynesScore, maxHappynesScore, stage.innerHeight() - 50, 50) - radius,
      "background-color": color,
    });

    area = map(country.population - populationAtheistic, 0, maxPopulation, 0, maxArea);
    radius = Math.sqrt(area / Math.PI);

    elementRigt.addClass("country");
    elementRigt.css({
      width: 2 * radius,
      height: 2 * radius,
      left: stage.innerWidth() * 0.7 - radius,
      top: map(country.happynesScore, minHappynesScore, maxHappynesScore, stage.innerHeight() - 50, 50) - radius,
      "background-color": color,
    });

    stage.append(elementLeft);
    stage.append(elementRigt);
  });
}

function atheisticStateV2(params) {
  const maxArea = 10000;

  let lefts = [], rights = [];

  data.forEach(country => {
    const color = getColor(country.happynesScore, minHappynesScore, maxHappynesScore);

    let elementLeft = $(`<div id="${country.countryName}_Left"></div>`);
    elementLeft.addClass("country");
    
    elementLeft.partialPopulation = country.population * 0.01 * country.shareOfAtheisticOrUnaffiliated;
    // when the percentage is 1(smallest possible value) we don't want the div to be shown
    if (country.shareOfAtheisticOrUnaffiliated === 1) elementLeft.partialPopulation = 0;
    elementLeft.area = map(elementLeft.partialPopulation, 0, maxPopulation, 0, maxArea);
    elementLeft.radius = Math.sqrt(elementLeft.area / Math.PI);
    elementLeft.yPos = map(country.happynesScore, minHappynesScore, maxHappynesScore, stage.innerHeight() - 50, 50);
    elementLeft.xPos = stage.innerWidth() * 0.3;
    
    elementLeft.css({
      width: 2 * elementLeft.radius,
      height: 2 * elementLeft.radius,
      left: elementLeft.xPos - elementLeft.radius,
      top: elementLeft.yPos- elementLeft.radius,
      "background-color": color,
    });

    lefts.push(elementLeft);


    let elementRigt = $(`<div id="${country.countryName}_Rigt"></div>`);
    elementRigt.addClass("country");

    elementRigt.partialPopulation = country.population * 0.01 * (100 - country.shareOfAtheisticOrUnaffiliated);
    elementRigt.area = map(elementRigt.partialPopulation, 0, maxPopulation, 0, maxArea);
    elementRigt.radius = Math.sqrt(elementRigt.area / Math.PI);
    elementRigt.yPos = map(country.happynesScore, minHappynesScore, maxHappynesScore, stage.innerHeight() - 50, 50);
    elementRigt.xPos = stage.innerWidth() * 0.7;

    elementRigt.css({
      width: 2 * elementRigt.radius,
      height: 2 * elementRigt.radius,
      left: elementRigt.xPos - elementRigt.radius,
      top: elementRigt.yPos - elementRigt.radius,
      "background-color": color,
    });

    rights.push(elementRigt);
  });


  const padding = 0;

  // überarbeiten      start with the second item!!!
  for (let a = 1; a < lefts.length; a++) {
    // move direction (+ or -)
    let moveDir = 1;
    if (Math.random() < 0.5) moveDir = -1;

    let thisElement = lefts[a]; 
    let prevElement = lefts[a - 1];

    // (when they are stacked onto each other move one initial pixel)
    if (thisElement.xPos === prevElement.xPos) thisElement.xPos += moveDir;


    const distance = Math.sqrt(Math.pow(thisElement.yPos - prevElement.yPos, 2) + Math.pow(thisElement.xPos - prevElement.xPos, 2));

    console.log(":  " + distance);

    if (distance - padding < thisElement.radius + prevElement.radius) {


      // determine a new TouchPoint
      let touchPoint = determineWishedTouchPoint(thisElement, prevElement);
      
      // determine the x coord of thisElement (at the touchPoints height)
      let thisElementsX = thisElement.xPos + Math.sqrt(thisElement.radius + Math.pow(touchPoint.y - thisElement.yPos, 2));

      console.log(thisElementsX);
      // let this element move the right amount to touch the touchpoint
      thisElement.xPos += thisElement.xPos - thisElementsX
      // update the css
      thisElement.css({
        left: thisElement.xPos
      });
      

      // do the same for the prevElement
      // determine the x coord of thisElement (at the touchPoints height)
      let prevElementsX = prevElement.xPos + Math.sqrt(prevElement.radius - Math.pow(touchPoint.y - prevElement.yPos, 2));

      // let this element move the right amount to touch the touchpoint
      prevElement.xPos += prevElement.xPos - prevElementsX;
      prevElement.css({
        left: prevElement.xPos
      });

      // then go back to the prev element and check against their prev element
      a -= 2;

    }

  }
  
  
  lefts.forEach(element => {
    stage.append(element);
  });
  rights.forEach(element => {
    stage.append(element);
  });
}

function drawPoint(x, y) {
  console.log("jjjjjj:" + x + ";  "+ y);
  let elem = $("<div></div>");
  elem.addClass("country");
  elem.css({
    width: 4,
    height: 4,
    left: x - 2,
    top: y - 2,
    "background-color": "green",
    "z-index": 5, 
  });
  // stage.append(elem);
}

let circ1 = {
  radius: 50,
  xPos: 400,
  yPos: 470,
};
let circ2 = {
  radius: 50,
  xPos: 440,
  yPos: 540,
};

let res = determineWishedTouchPoint(circ1, circ2);
let point = {
  radius: 5,
  xPos: res.x,
  yPos: res.y
};


let circ1elem = $(`<div></div>`);
let circ2elem = $(`<div></div>`);
let pointPoint = $(`<div></div>`);

circ1elem.addClass("country");
circ2elem.addClass("country");
pointPoint.addClass("country");

circ1elem.css({
  width: 2 * circ1.radius,
  height: 2 * circ1.radius,
  left: circ1.xPos - circ1.radius,
  top: circ1.yPos - circ1.radius,
  "background-color": "red",
  "z-index": 1
});

circ2elem.css({
  width: 2 * circ2.radius,
  height: 2 * circ2.radius,
  left: circ2.xPos - circ2.radius,
  top: circ2.yPos - circ2.radius,
  "background-color": "blue",
  "z-index": 1
});

// determine a new TouchPoint
let touchPoint = determineWishedTouchPoint(circ1, circ2);
      
// determine the x coord of circ1 (at the touchPoints height)
let circ1sX = circ1.xPos + Math.sqrt(circ1.radius + Math.pow(touchPoint.y - circ1.yPos, 2));
console.log("hallo" + circ1sX);
// if this element is left from the touchpoint we have to use x2 (the right value for y)
if (circ1.xPos < touchPoint.x) circ1sX -= circ1.xPos - circ1sX;



console.log(circ1sX);
// let this element move the right amount to touch the touchpoint
circ1.xPos += circ1.xPos - circ1sX;
drawPoint(circ1sX,touchPoint.y);
// circ1.xPos = circ1.xPos - (circ1sX - touchPoint.x);

// update the css
circ1elem.css({
  left: circ1.xPos
});


// do the same for the circ2
// determine the x coord of thisElement (at the touchPoints height)
let circ2sX = circ2.xPos + Math.sqrt(circ2.radius + Math.pow(touchPoint.y - circ2.yPos, 2));

if (circ2.xPos < touchPoint.x) circ2sX -= circ2.xPos - circ2sX;


// let this element move the right amount to touch the touchpoint
circ2.xPos += circ2.xPos - circ2sX;
circ2elem.css({
  left: circ2.xPos
});

pointPoint.css({
  width: 2 * point.radius,
  height: 2 * point.radius,
  left: point.xPos - point.radius,
  top: point.yPos - point.radius,
  "background-color": "black",
  "z-index": 3, 
});

// stage.append(circ1elem);
// stage.append(circ2elem);
// stage.append(pointPoint);


function determineWishedTouchPoint(circle1, circle2) {
  const r1 = circle1.radius;
  const x1 = circle1.xPos;
  const y1 = circle1.yPos;

  const r2 = circle2.radius;
  const x2 = circle2.xPos;
  const y2 = circle2.yPos;
  // c is the slope of the line between the circle centers
  const a = y1 - x1 * ((y2 - y1) / (x2 - x1));
  const b = ((r1*r1) - (r2*r2) - (x1 * x1) + (x2 * x2) - (y1 * y1) + (y2 * y2)) / (2 * (y2 - y1));
  const c = (x1 - x2) / (y2 - y1);
  const d = (y2 - y1) / (x2 - x1);

  // equate straight and resolve to x
  const x = (b - a) / (d - c);

  // get y by pasting x into one of the straights equations
  const y = (d * x + (y1 - x1 * d));

  // console.log(x1 + ":" + y1);
  // console.log(x2 + ":" + y2);
  // console.log(x + ":" + y);
  // console.log(c);



  // returns the wishedTouchPoints coords
  return {x: x, y: y};
}
