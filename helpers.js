function determineWishedTouchPoint(circle1, circle2) {
  const r1 = circle1.radius;
  const x1 = circle1.xPos;
  const y1 = circle1.yPos;

  const r2 = circle2.radius;
  const x2 = circle2.xPos;
  const y2 = circle2.yPos;
  for (let d = x1; d < x2; d++) {
    let y = ((r1*r1) - (r2*r2) - (x1 * x1 - x2 * x2) - (y1 * y1 - y2 * y2)) / (2 * (y2 - y1)) + ( (2 * d * (x1 - x2)) / (2 * (y2-y1)));
    // let y = ((y2 - y1)/(x2 - x1)) * d + y1 - ((y2 - y1)/(x2 - x1)) * x1;

    const radius = 5;
    let obj = $(`<div></div>`);
    obj.addClass("country");
    obj.css({
      width: 2 * radius,
      height: 2 * radius,
      left: d - radius,
      top: y - radius,
      "background-color": "black",
      "z-index": 2
    });
    stage.append(obj);
  }

  // c is the slope of the line between the circle centers
  const a = y1 - x1 * ((y2 - y1) / (x2 - x1));
  const b = ((r1*r1) - (r2*r2) - (x1 * x1) + (x2 * x2) - (y1 * y1) + (y2 * y2)) / (2 * (y2 - y1));
  const c = (x1 - x2) / (y2 - y1);
  const d = (y2 - y1) / (x2 - x1);

  // equate straight and resolve to x
  const x = (b - a) / (d - c);

  // get y by pasting x into one of the straights equations
  const y = (d * x + (y1 - x1 * d));

  console.log(x1 + ":" + y1);
  console.log(x2 + ":" + y2);
  console.log(x + ":" + y);
  console.log(c);



  // returns the wishedTouchPoints coords
  return {x: x, y: y};
}





function determineWishedTouchPoint(circle1, circle2) {
  const r1 = circle1.radius;
  const x1 = circle1.xPos;
  const y1 = circle1.yPos;

  const r2 = circle2.radius;
  const x2 = circle2.xPos;
  const y2 = circle2.yPos;

  if (x2 > x1) {
    for (let d = x1; d < x2; d++) {
      let y = ((r1*r1) - (r2*r2) + 2 * d * (x1 - x2) - (x1 * x1 - x2 * x2) - (y1 * y1 - y2 * y2)) / (2 * (y2 - y1));
      // let y = ((y2 - y1)/(x2 - x1)) * d + y1 - ((y2 - y1)/(x2 - x1)) * x1;

      r1 = e
      r2 = g
      ((d - b)/(c - a)) * x + b - ((d - b)/(c - a)) * a = ((e*e) - (g*g) + 2 * x * (a - c) - (a * a - c * c) - (b * b - d * d)) / (2 * (d - b))


      const radius = 5;
      let obj = $(`<div></div>`);
      obj.addClass("country");
      obj.css({
        width: 2 * radius,
        height: 2 * radius,
        left: d - radius,
        top: y - radius,
        "background-color": "black",
        "z-index": 2
      });
      stage.append(obj);
    }
  } else {
    for (let d = x2; d < x1; d--) {
      let y = ((r1*r1) - (r2*r2) + 2 * d * (x1 - x2) + (x1 * x1 - x2 * x2) - (y1 * y1 - y2 * y2)) / (2 * (y2 - y1));

      const radius = 5;
      let obj = $(`<div></div>`);
      obj.addClass("country");
      obj.css({
        width: 2 * radius,
        height: 2 * radius,
        left: d - radius,
        top: y - radius,
        "background-color": "black",
        "z-index": 2, 
      });
      stage.append(obj);
    }
  }
  
}

