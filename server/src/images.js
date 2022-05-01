module.exports.preloadImages = function () {
    var images = {
        idleRight: [],
        idleLeft: [],
        walkRight: [],
        walkLeft: [],
        sleepRight: [],
        sleepLeft: []
    }

    for (var i = 0; i < 4; i++) {
        images.idleRight.push(new Image());
        images.idleRight[i].src = './images/idleRight/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.idleLeft.push(new Image());
        images.idleLeft[i].src = './images/idleLeft/' + i + '.png';
    }

    for (var i = 0; i < 8; i++) {
        images.walkRight.push(new Image());
        images.walkRight[i].src = './images/walkRight/' + i + '.png';
    }

    for (var i = 0; i < 8; i++) {
        images.walkLeft.push(new Image());
        images.walkLeft[i].src = './images/walkLeft/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.sleepRight.push(new Image());
        images.sleepRight[i].src = './images/sleepRight/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.sleepLeft.push(new Image());
        images.sleepLeft[i].src = './images/sleepLeft/' + i + '.png';
    }

    return images
}