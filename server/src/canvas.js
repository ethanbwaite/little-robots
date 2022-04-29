module.exports = function drawCanvas() {
  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200,0,0)';
    ctx.fillRect(25, 25, 100, 100);
    console.log('canvas is supported');
  } else {
    // canvas-unsupported code here
  }
}