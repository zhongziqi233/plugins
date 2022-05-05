// rely on mapbox
// draw on canvas
function drawHeatmap(){
    // remove the older canvas
    let canvasOld = document.getElementById("Heatmap");
    if(canvasOld){
      document.getElementById('map').removeChild(canvasOld);
    }
    // creat a new canvas
    const canvas = this.createCanvas("Heatmap");
    var context = canvas.getContext("2d");
    var zoomLevel = this.map.getZoom();  // mapbox's map
    var radiuScale = d3.scaleLinear()
      .domain([1, 17])
      .range([20, 50])
    var radius = radiuScale(zoomLevel);
    /*
      'values' was an array of the needed value of the heatmap
      values = [x, y...]
    */
    // get the maxium and minium of values
    var max = Math.floor(Math.max.apply(null, this.values) * 100) / 100;
    var min = Math.floor(Math.min.apply(null, this.values) * 100) / 100;

    // sortId was the data sorted from small to large by the needed value of the heatmap
    var sortId = this.sortId;

    var heatSites = []
    /* 
      'locData' was an array of the lng & lat attribute of each points
      locData = [{lng: x, lat: y},{lng: x, lat: y}...]
    */

    // project the points to the map
    for (let i in this.heatGeo) {
        heatSites.push(
          this.map.project([locData[i].lng, locData[i].lat])
        );
    }

    // get the interpolation of colors
    function interp(rate){
      var colorScale = d3.interpolate(["#0085ff20", "#00ffff70", "#00ff00c0", "#ffff00f0", "#ff6600f5"], ["#00ffff70", "#00ff00c0", "#ffff00f0", "#ff6600f5", "#ff0000fa"])
      return colorScale(rate)
    }

    // get the radiaGradient of each point
    function getGradient(x, y, radius, rate){
      let radialGradient = context.createRadialGradient(x, y, 0, x, y, radius * rate);
      let step = parseFloat((rate / 5).toFixed(3));
      if (step == 0) step = 0.001;
      for(let i = 0, j = 0; i <= 1; i += 0.2, j += step) {
        let chunk = parseInt(j / 0.2)
        let loc = ((j % 0.2) / 0.2).toFixed(2)
        if (chunk == 5) --chunk;
        radialGradient.addColorStop(1 - i, interp(loc)[chunk]);
      }
      return radialGradient
    }

    // rendering points of heatmap
    this.clearTimers();
    for(let i = 0; i < heatSites.length; i++) {
      let x = Math.floor(heatSites[sortId[i]].x * 1000) / 1000;
      let y = Math.floor(heatSites[sortId[i]].y * 1000) / 1000;
      let value = this.values[i];
      let rating = (value - min) / (max - min);
      this.timers.push(
        setTimeout(() => {
          try {
            context.beginPath();
            context.arc(x, y, radius * rating, 0, 2 * Math.PI);
            context.closePath();
            let alphaShift = d3.scaleLinear()
              .domain([0, 1])
              .range([0.15, 0.55])
            let radialGradient = getGradient(x, y, radius, rating)
            context.fillStyle = radialGradient;
            context.globalAlpha = alphaShift(rating);
            context.fill();
          } catch(err) {console.log(err)}
        }, 1 * parseInt(this.timers.length/100))
      );
    }
}

// create a canvas
function createCanvas(id) {
    let mapCanvas = document.getElementById(id);
    if (mapCanvas) {
      mapCanvas.remove();
    }
    const canvas = document.createElement("canvas");
    canvas.id=id;
    const canvasCantainer = document.getElementById("map");
    const canvasWidth = canvasCantainer.clientWidth;
    const canvasHeight = canvasCantainer.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    if(id != "hull")
      canvas.style.pointerEvents = "none";
    canvas.id = id;
    document.getElementById("map").appendChild(canvas);
    return canvas;
}