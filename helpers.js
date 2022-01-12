// this function determines the point, in wich the line between the circle centers touch and the line between the circles intersection
function determineWishedTouchPoint(circle1, circle2) {
  const r1 = circle1.radius;
  const x1 = circle1.xPos;
  const y1 = circle1.yPos;

  const r2 = circle2.radius;
  const x2 = circle2.xPos;
  const y2 = circle2.yPos;

  // c is the slope of the line between the circle centers
  const c = (y2 - y1) / (x2 - x1);

  // equate straight and resolve to x
  const x = ( (r1*r1 - r2*r2) + (x1*x1 - x2*x2) + (y2*y2 - y1*y1) - 2 * ((y2 - y1) * (y1 - x1 * c)))  /  (2 * ((y2 - y1) * c + x2 - x1));

  // get y by pasting x into one of the straights equations
  const y = (c * x + (y1 - x1 * c));

  console.log(x1 + ":" + y1);
  console.log(x2 + ":" + y2);
  console.log(x + ":" + y);
  console.log(c);



  // returns the wishedTouchPoints coords
  return {x: x, y: y};
}
