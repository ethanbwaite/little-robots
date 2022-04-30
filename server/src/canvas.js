module.exports = function drawCanvas(userMap, socketId) {
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
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      if (user.connected) {
        ctx.fillText('Connected', user.x, user.y + 35);
      } else {
        ctx.fillText('Not connected', user.x, user.y + 35);
      }
      if (user.socket === socketId) {
        ctx.fillText(user.id, user.x, user.y + 25);
        ctx.fillStyle = 'red';
        ctx.fillText('You', user.x, user.y + 45);
      }
    }

  } else {
    console.log('Canvas not supported :(');
    // canvas-unsupported code here
  }
}