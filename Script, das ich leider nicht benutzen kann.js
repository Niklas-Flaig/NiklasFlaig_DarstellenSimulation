  /*
    now check for ell elements, if they touch, and if they do, adapt their xPos
    start with the second Item, because you cant compare the first element against anything
    compare the current element against all previous
  */
  for (let a = 1; a < rights.length; a++) {
    
    let thisElement = rights[a];
    
    let madeChanges = false;

    for (let b = a - 1; b >= 0; b--) {
      let prevElement = rights[b];

      // when the both circles center share the same x Position
      // move this Element a intitial Pixel in a random direction
      if (thisElement.xPos === prevElement.xPos) {
        if (Math.random() < 0.5) {
          thisElement.xPos --;
        } else {
          thisElement.xPos ++;
        }
      }
      
      // determine the distancebetween the circles centers
      const distance = Math.sqrt(Math.pow(thisElement.yPos - prevElement.yPos, 2) + Math.pow(thisElement.xPos - prevElement.xPos, 2));
      
      /* if one circle sits inside the other
          move the smaller circle to the edge of the bigger circle
          this is also brute force, not a smart function :(
        */
      if (distance + thisElement.radius <= prevElement.radius || distance + prevElement.radius <= thisElement.radius) {
        // when the smaller circles center is left of the bigger ones
        if (thisElement.xPos < prevElement.xPos) {
          thisElement.xPos = prevElement.xPos - prevElement.radius;
        } else if (thisElement.xPos > prevElement.xPos) { // when the smaller circles center is left of the bigger ones
          thisElement.xPos = prevElement.xPos + prevElement.radius;
        }
      }


      // when the distance is smaller than the combined radius the circles either cross or one inherits the other
      if (distance - padding < thisElement.radius + prevElement.radius) {
        
        // determine a new TouchPoint
        let touchPoint = determineWishedTouchPoint(thisElement, prevElement);
        let consol = thisElement.xPos + ":" + prevElement.xPos + "----" + thisElement.radius + ":" + prevElement.radius;
        
        if (thisElement.xPos > prevElement.xPos) {
          thisElement.xPos = moveCircleInX(thisElement, touchPoint, "left");
          prevElement.xPos = moveCircleInX(prevElement, touchPoint, "right");
        } else if (thisElement.xPos < prevElement.xPos) {
          thisElement.xPos = moveCircleInX(thisElement, touchPoint, "right");
          prevElement.xPos = moveCircleInX(prevElement, touchPoint, "left");
        }
        console.log(consol + "----" + thisElement.xPos + ":" + prevElement.xPos);
        thisElement.xPos = Math.round(thisElement.xPos);
        prevElement.xPos = Math.round(prevElement.xPos);
        
        madeChanges = true;
      }
    }

    // then go back to the prev element and check against their prev element
    if (madeChanges) a = 1;

    // if (a < 1) a = 1;
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
  