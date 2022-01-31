let stage = $("#canvas");
// const label = $("#mouseover-label");

// const colors = ["#BE5050", "#E3E04B"];
// const colors = ["#BE5050", "#97E34B"];
// const colors = ["#C1374F", "#E3E04B"];
// const colors = ["#9f5050", "#865353", "#A6FB10"];
const colors = ["#A6DB10", "#865353"];
// const colors = ["#A6DB10", "#C78D42", "#865353"];

// to be able to recreate the data w/out having to re createWorkData() ==> better performance!
const dataNoEdit = createWorkData();

let data = createWorkData();
// get the relevant maxValues
const maxPopulation = getMaxValue("population", data);
const minPopulation = getMinValue("population", data);

const maxHappynesScore = getMaxValue("happynesScore", data);
const minHappynesScore = getMinValue("happynesScore", data);

const maxSuicideRate = getMaxValue("suicideRate", data);
const minSuicideRate = getMinValue("suicideRate", data);

// initial render stuff in here
$(function () {
  drawMapState();
  
  /* the gui wich makes it possible ot the user to manupalte the Website*/
  userInter();

});


function render(currentState) {
  console.log(data);
  document.querySelector("#canvas").innerHTML = "";
  switch (currentState) {
    case "worldMap":
      drawMapState();
      break;
    case "atheistic":
      atheisticState();
      break;
    case "suicide":
      drawRainState(true);
      break;
  }
}
// window.addEventListener('resize', drawRainState);

// the area displays the population-size
function drawMapState(autoArea = true) {
  
  if (autoArea === true) {
    let maxRadius = determinAutoRadius();

    let move = centerMap(maxRadius);
  
    data.forEach(country => {
      // the dots positon on the stage is the raw 
      // 1. shift position to positiv values; 2. scale the value to a the stagesSize
      const xPosition = map(country.longitude + 180, 0, 360, 0, stage.innerWidth()) + move.x;
      const yPosition = map(country.latitude + 90, 0, 180, stage.innerHeight(), 0) + move.y;
  
      // const area = map(country.population, 0, maxPopulation, 0, maxArea);
      // const radius = Math.sqrt(area / Math.PI);
      const radius = map(country.population, 0, maxPopulation, 0, maxRadius);
  
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
  } else { 
    /*
      the radius depends on a maxValue
      to show all points, sort the countrys
      and put the smaller in front of the bigger ones
    */
    let maxRadius = 100;
    
    let move = centerMap(maxRadius);
    
    data = sortFor("population", true);

    for (let a = 0; a < data.length; a++) {
      const country = data[a];
      // the dots positon on the stage is the raw 
      // 1. shift position to positiv values; 2. scale the value to a the stagesSize
      const xPosition = map(country.longitude + 180, 0, 360, 0, stage.innerWidth()) + move.x;
      const yPosition = map(country.latitude + 90, 0, 180, stage.innerHeight(), 0) + move.y;
  
      // const area = map(country.population, 0, maxPopulation, 0, maxArea);
      // const radius = Math.sqrt(area / Math.PI);
      const radius = map(country.population, 0, maxPopulation, 0, maxRadius);
  
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
        "z-index": a,
        "background-color": color,
      });
  
      stage.append(countryElement);
  
    }
  }



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

// still has some problems e.g.Niger and Nigeria
function determinAutoRadius(key = "population", padding = 2) {
  // the biggest size the Area can get
  let maxRadius = 100000;

  for (let a = 0; a < data.length; a++) {
    const countryA = data[a];
    
    const yPosA = map(countryA.longitude + 180, 0, 360, 0, stage.innerWidth());
    const xPosA = map(countryA.latitude + 90, 0, 180, stage.innerHeight(), 0);
    
    let maxPossibleRadiusForA = maxRadius; // stores the currently biggest size for the Radius of A
    // only has to check against all countrys coming after
    for (let b = a + 1; b < data.length; b++) {
      const countryB = data[b];

      const yPosB = map(countryB.longitude + 180, 0, 360, 0, stage.innerWidth());
      const xPosB = map(countryB.latitude + 90, 0, 180, stage.innerHeight(), 0);

      /* 
        the distance has to be rounded down, because the elements final Position gets rounded too
        theoretically all values have to be rouunded, always meh
      */
      const distanceAB = Math.sqrt(Math.pow(yPosA - yPosB, 2) + Math.pow(xPosA - xPosB, 2));
      // compare maxPossibleRadiusOnAForThisCombi against currently maxPossibleRadiusForA
      // dont multiply the distance!!!
      let maxPossibleRadiusOnAForThisCombi = (distanceAB - padding) / ((countryA[key] + countryB[key]) / countryA[key]);
      if (maxPossibleRadiusOnAForThisCombi < maxPossibleRadiusForA) maxPossibleRadiusForA = maxPossibleRadiusOnAForThisCombi;
    }
    
    // compare final maxPossibleRadiusForA against current maxRadius
    let maxRadiusNeededToFitA = (maxPossibleRadiusForA / countryA[key]) * maxPopulation;
    if (maxRadiusNeededToFitA < maxRadius) maxRadius = maxRadiusNeededToFitA;
  }

  return maxRadius; // returns radius    (Math.PI * Math.pow(maxRadius, 2))
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

      // the intervall in wich the drops will appear
      const dropTime = map(country.suicideRate, minSuicideRate, maxSuicideRate, 10000, 1000);

      setTimeout(() => { // this first timeout makes it appear, as if the rain is just starting: very cool
        newRainDrop({x: ((xMax - 2 * padding) / data.length * a) + padding, y: 100}, dropTime);
      }, (Math.random() * 10000)); // the first timeout is a random timespan between one and 10 seconds
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

  let countryOpac = $(`<div></div>`);
  countryOpac.addClass("rainCountry");
  countryOpac.css({
    width: 8,
      height: 8,
      left: startPos.x - 4, // -4 = width / 2
      top: 100,
      "background-color": "#181818",
  });
  stage.append(countryOpac);



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
        top: Math.min(startPos.y + time * speed, stage.innerHeight() - Math.round(2 + 12 * speed)), // 200 = maximal endPos,
        height: Math.round(2 + 12 * speed),
      });

      rainDropShadow.css({
        height: Math.min(time * speed, stage.innerHeight() - startPos.y),
        opacity: 100 / time
      });

      countryOpac.css({
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
      countryOpac.remove();
    }
  }
}

function atheisticState(params) {
  const maxArea = 10000;

  let lefts = [], rights = [];

  /* create two elements for each country
      one goes to the right (symbols the non-atheistic part of the countrys Population)
      the other to the left (symbols the atheistic part)
      
    they share the same height and color => displaying the happyness in the country

    the size of the circles display the amount of persons
  */
  data.forEach(country => {

    let shared = {
      yPos: map(country.happynesScore, minHappynesScore, maxHappynesScore, stage.innerHeight() - 50, 50),
      color: getColor(country.happynesScore, minHappynesScore, maxHappynesScore),
    };

    // the atheistic part
    let elementLeft = $(`<div id="${country.countryName}_Left"></div>`);
    elementLeft.addClass("country");

    elementLeft.yPos = shared.yPos;
    elementLeft.partialPopulation = country.population * 0.01 * country.shareOfAtheisticOrUnaffiliated;
    // when the percentage is 1(smallest possible value) we don't want the div to be shown at all
    // if (country.shareOfAtheisticOrUnaffiliated === 1) elementLeft.partialPopulation = 0;
    elementLeft.countryName = country.countryName;
    elementLeft.area = map(elementLeft.partialPopulation, 0, maxPopulation, 0, maxArea);
    elementLeft.radius = Math.sqrt(elementLeft.area / Math.PI);
    elementLeft.xPos = stage.innerWidth() * 0.3;
    elementLeft.color = shared.color;

    elementLeft.css({
      width: 0,
      height: 0,
      left: elementLeft.xPos,
      top: elementLeft.yPos,
      "background-color": elementLeft.color,
    });

    lefts.push(elementLeft);


    // the atheistic part
    let elementRigt = $(`<div id="${country.countryName}_Right"></div>`);
    elementRigt.addClass("country");

    elementRigt.yPos = shared.yPos;
    elementRigt.partialPopulation = country.population * 0.01 * (100 - country.shareOfAtheisticOrUnaffiliated);
    elementRigt.countryName = country.countryName;
    elementRigt.area = map(elementRigt.partialPopulation, 0, maxPopulation, 0, maxArea);
    elementRigt.radius = Math.sqrt(elementRigt.area / Math.PI);
    elementRigt.xPos = stage.innerWidth() * 0.7;
    elementRigt.color = shared.color;

    elementRigt.css({
      width: 0,
      height: 0,
      left: elementLeft.xPos,
      top: elementRigt.yPos,
      "background-color": elementRigt.color,
    });


    rights.push(elementRigt);
  });

  lefts = sortFor("area", true, lefts);
  rights = sortFor("area", true, rights);


  const padding = 4;
  
  for (let a = 1; a < lefts.length; a++) {
    const thisElement = lefts[a];
    
    let direction = -1;
    if (Math.random() < 0.5) direction = 1;
    
    for (let b = 0; b < a; b++) {
      // use "madeChanges", because a smaller circle could touch a bigger one if the bigger one passed them
      let madeChanges = false;
      const prevElement = lefts[b];

      let distance = Math.sqrt(Math.pow(thisElement.yPos - prevElement.yPos, 2) + Math.pow(thisElement.xPos - prevElement.xPos, 2));

      // while their distance is smaller than their radius
      while (distance - padding < thisElement.radius + prevElement.radius) {
        thisElement.xPos += direction;
        distance = Math.sqrt(Math.pow(thisElement.yPos - prevElement.yPos, 2) + Math.pow(thisElement.xPos - prevElement.xPos, 2));
        madeChanges = true;
      }
      if (madeChanges) b = 0;
    }
  }

  for (let a = 1; a < rights.length; a++) {
    const thisElement = rights[a];
    
    let direction = -1;
    if (Math.random() < 0.5) direction = 1;
    
    for (let b = 0; b < a; b++) {
      // use "madeChanges", because a smaller circle could touch a bigger one if the bigger one passed them
      let madeChanges = false;
      const prevElement = rights[b];

      let distance = Math.sqrt(Math.pow(thisElement.yPos - prevElement.yPos, 2) + Math.pow(thisElement.xPos - prevElement.xPos, 2));

      // while their distance is smaller than their radius
      while (distance - padding < thisElement.radius + prevElement.radius) {
        thisElement.xPos += direction;
        distance = Math.sqrt(Math.pow(thisElement.yPos - prevElement.yPos, 2) + Math.pow(thisElement.xPos - prevElement.xPos, 2));
        madeChanges = true;
      }
      if (madeChanges) b = 0;
    }
  }
  
  lefts.forEach(element => {
    let newElem = $(`<div id="${element.countryName}_Left"></div>`);
    newElem.addClass("country");

    newElem.css({
      width: 2 * element.radius,
      height: 2 * element.radius,
      left: element.xPos - element.radius,
      top: element.yPos - element.radius,
      "background-color": element.color,
    });
    stage.append(newElem);
  });
  
  rights.forEach(element => {
    let newElem = $(`<div id="${element.countryName}_Rigt"></div>`);
    newElem.addClass("country");

    newElem.css({
      width: 2 * element.radius,
      height: 2 * element.radius,
      left: element.xPos - element.radius,
      top: element.yPos - element.radius,
      "background-color": element.color,
    });
    stage.append(newElem);
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
  stage.append(elem);
}

// let circ1 = {
//   radius: 100,
//   xPos: 270,
//   yPos: 270,
// };
// let circ2 = {
//   radius: 50,
//   xPos: 210,
//   yPos: 190,
// };

// let res = determineWishedTouchPoint(circ1, circ2);
// let point = {
//   radius: 5,
//   xPos: res.x,
//   yPos: res.y
// };


// let circ1elem = $(`<div></div>`);
// let circ2elem = $(`<div></div>`);
// let pointPoint = $(`<div></div>`);

// circ1elem.addClass("country");
// circ2elem.addClass("country");
// pointPoint.addClass("country");

// circ1elem.css({
//   width: 2 * circ1.radius,
//   height: 2 * circ1.radius,
//   left: circ1.xPos - circ1.radius,
//   top: circ1.yPos - circ1.radius,
//   "background-color": "red",
//   "z-index": 1
// });

// circ2elem.css({
//   width: 2 * circ2.radius,
//   height: 2 * circ2.radius,
//   left: circ2.xPos - circ2.radius,
//   top: circ2.yPos - circ2.radius,
//   "background-color": "blue",
//   "z-index": 1
// });

// // determine a new TouchPoint
// if (1 + circ2.radius <= circ1.radius) {
//   // Inside
//   console.log("Circle2 is inside Circle1");
// }
// let touchPoint = determineWishedTouchPoint(circ1, circ2);
// circ1.xPos = moveCircleInX({radius: circ1.radius, x: circ1.xPos, y: circ1.yPos}, touchPoint, "right");
// circ2.xPos = moveCircleInX({radius: circ2.radius, x: circ2.xPos, y: circ2.yPos}, touchPoint, "left");

// // update the css
// circ1elem.css({
//   left: circ1.xPos - circ1.radius
// });



// // let this element move the right amount to touch the touchpoint
// circ2elem.css({
//   left: circ2.xPos - circ2.radius
// });

// pointPoint.css({
//   width: 2 * point.radius,
//   height: 2 * point.radius,
//   left: point.xPos - point.radius,
//   top: point.yPos - point.radius,
//   "background-color": "black",
//   "z-index": 3, 
// });

// stage.append(circ1elem);
// stage.append(circ2elem);
// stage.append(pointPoint);
/*
  this function moves the circles, that are given to this function in x-direction
  to touch a specific point

  the direction, that the circle is moved in, depends on the position of the circle
  relative to the point: 
    circle(s center) sits to the points right => move the circle to the right
*/
function moveCircleInX(circle, point, direction = "right") {
  // determine the x coord of the circle (at the points height)
  let circlesXatPointsHeight;
  // because a circle has 2 x values for most y values: look, wich one is needed
    // when the circle is right of the point
  if (direction === "right") circlesXatPointsHeight = circle.xPos - Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(point.y - circle.yPos, 2));
    // when the circle is left of the point
  if (direction === "left") circlesXatPointsHeight = circle.xPos + Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(point.y - circle.yPos, 2));
  // drawPoint(circlesXatPointsHeight, point.y);


  // move the circle in x-direction (the difference of the determined x-value of the circle and the points x-value)
  circle.xPos -= circlesXatPointsHeight - point.x;
  return circle.xPos;
}

/* 
  this function determines the crossing point of two lines

  the first line is the line between the two circle-middlePoints
  the second line is the line between the points where the circles cross
*/
function determineWishedTouchPoint(circle1, circle2) { // the two circles have to cross each other
  const r1 = circle1.radius;
  const x1 = circle1.xPos;
  const y1 = circle1.yPos;

  const r2 = circle2.radius;
  const x2 = circle2.xPos;
  const y2 = circle2.yPos;

  // a b c d are parts of the equation, that returns the x value of the two-lines-crossing-point
  const a = y1 - x1 * ((y2 - y1) / (x2 - x1));
  const b = ((r1*r1) - (r2*r2) - (x1 * x1) + (x2 * x2) - (y1 * y1) + (y2 * y2)) / (2 * (y2 - y1));
  const c = (x1 - x2) / (y2 - y1);
  const d = (y2 - y1) / (x2 - x1);

  // equate straight and resolve to x
  const x = (b - a) / (d - c);

  // get y by pasting x into one of the straights equations
  const y = (d * x + (y1 - x1 * d));

  drawPoint(x,y);
  // returns the wishedTouchPoints coords
  return {x: x, y: y};
}
