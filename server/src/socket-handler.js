var drawCanvas = require('./canvas.js');

module.exports = function socket() {
    var socket = io();
    
    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');

    document.addEventListener('keydown', function(e) {
        socket.emit('key_down', e.key);
    });

    document.addEventListener('keyup', function(e) {
        socket.emit('key_up', e.key);
    });

    socket.on('user_list', function(userList) {
        console.log('user_list');
        drawCanvas(userList);
    });


        


    // form.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     if (input.value) {
    //     socket.emit('chat message', input.value);
    //     input.value = '';
    //     }
    // });

    // socket.on('chat message', function(msg) {
    //     var li = document.createElement('li');
    //     li.textContent = msg;
    //     messages.appendChild(li);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });

    // socket.on('user disconnected', function(msg) {
    //     var li = document.createElement('li');
    //     li.textContent = 'User has disconnected';
    //     messages.appendChild(li);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });
}