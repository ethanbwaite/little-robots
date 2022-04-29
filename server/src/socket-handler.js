module.exports = function socket() {
    var socket = io();
    
    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');

    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowUp':
                socket.emit('up_pressed');
                break;
            case 'ArrowDown':
                socket.emit('down_pressed');
                break;
            case 'ArrowLeft':
                socket.emit('left_pressed');
                break;
            case 'ArrowRight':
                socket.emit('right_pressed');
                break;
        }
    });

    document.addEventListener('keyup', function(e) {
        switch (e.key) {
            case 'ArrowUp':
                socket.emit('up_released');
                break;
            case 'ArrowDown':
                socket.emit('down_released');
                break;
            case 'ArrowLeft':
                socket.emit('left_released');
                break;
            case 'ArrowRight':
                socket.emit('right_released');
                break;
        }
    });
}