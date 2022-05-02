module.exports.preloadImages = function () {
    var images = {
        idleRight: [],
        idleLeft: [],
        walkRight: [],
        walkLeft: [],
        sleepRight: [],
        sleepLeft: [],
        jumpRight: [],
        jumpLeft: [],
        lickRight: [],
        lickLeft: [],
        pokeRight: [],
        pokeLeft: [],
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

    for (var i = 0; i < 7; i++) {
        images.jumpRight.push(new Image()); 
        images.jumpRight[i].src = './images/jumpRight/' + i + '.png';
    }

    for (var i = 0; i < 7; i++) {
        images.jumpLeft.push(new Image());
        images.jumpLeft[i].src = './images/jumpLeft/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.lickRight.push(new Image());
        images.lickRight[i].src = './images/lickRight/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.lickLeft.push(new Image());
        images.lickLeft[i].src = './images/lickLeft/' + i + '.png';
    }

    for (var i = 0; i < 6; i++) {
        images.pokeRight.push(new Image());
        images.pokeRight[i].src = './images/pokeRight/' + i + '.png';
    }

    for (var i = 0; i < 6; i++) {
        images.pokeLeft.push(new Image());
        images.pokeLeft[i].src = './images/pokeLeft/' + i + '.png';
    }

    return images
}
