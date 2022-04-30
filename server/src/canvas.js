module.exports = function drawCanvas(userMap) {
  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var users = Object.values(userMap);
    for (var i = 0; i < users.length; i++) {
      var user = users[i];

      ctx.beginPath();
      ctx.arc(user.x, user.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = user.color;
      ctx.fill();
    }

    console.log('canvas is supported');
  } else {
    // canvas-unsupported code here
  }
}