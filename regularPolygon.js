// summon a Regular Polygon
// edge >= 3
function summonRegularPolygonPath(center, radiu, edge) {
    // define some origin things
    let startAngle = Math.PI / 2;
    let step = 2 * Math.PI / edge;
    // create an array to contain each points of the polygon
    let polygon = [];
    // attach points
    for(let i = 0; i < edge - 1; i++) {
      let angle = startAngle - step * i;
      let xFix = Math.sin(angle) * radiu;
      let yFix = Math.cos(angle) * radiu;
      console.log([center[0] + xFix, center[1] + yFix])
      polygon.push([center[0] + xFix, center[1] + yFix]);
    }
    // link head & tail
    polygon.push(polygon[0]);
    return polygon;
}