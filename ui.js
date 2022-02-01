let gui = $("#gui");

function userInter() {
  tabs();
}

function sliders() {
  let sliderLow = $(`<input id="lowerSlider" type="range" min="0" max="49" value="0">`);
  let sliderUp = $(`<input id="upperSlider" type="range" min="50" max="100" value="100">`);

  gui.append(sliderLow);
  gui.append(sliderUp);
  
  let sliderLeft = document.getElementById("lowerSlider");
  let sliderRight = document.getElementById("upperSlider");
  
  const readSlider = () => {
    /* .value is a string */
    let middlePoint = Math.round((parseFloat(sliderLeft.value) + parseFloat(sliderRight.value)) / 2);

    console.log(middlePoint);

    sliderLeft.max = middlePoint;
    sliderRight.min = middlePoint;
    
    sliderLow.css({
      width: `${middlePoint}%`,
    });
    
    sliderUp.css({
      width: `${100 - middlePoint}%`,
    });
  };
  /* if reRender is part of readSlider: it LAGGS */
  sliderLeft.oninput = readSlider;
  sliderRight.oninput = readSlider;
  
  
  // reRenders the current state but with a new dataArray
  const reRender = () => {
    data = filterData("happynesScore", parseFloat(sliderLeft.value), parseFloat(sliderRight.value));
    render("worldMap");
  };

  /* mouseUp against the lagg */
  sliderLeft.addEventListener("mouseup", reRender);
  sliderRight.addEventListener("mouseup", reRender);
}

function tabs() {
  let worldMap = $(`<a id="worldSwitcher" class="tab">Map</a>`);
  let atheistic = $(`<a id="atheisticSwitcher" class="tab">Atheistic</a>`);
  let suicide = $(`<a id="suicideSwitcher" class="tab">suicide</a>`);
  
  worldMap.css({

  });
  atheistic.css({

  });
  suicide.css({

  });

  gui.append(worldMap);
  gui.append(atheistic);
  gui.append(suicide);


  /* listeners */
  document.querySelector("#worldSwitcher").addEventListener("click", () => {
    render("worldMap");
  });

  document.querySelector("#atheisticSwitcher").addEventListener("click", () => {
    render("atheistic");
  });

  document.querySelector("#suicideSwitcher").addEventListener("click", () => {
    render("suicide");
  });
  

}