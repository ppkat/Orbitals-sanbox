module.exports = class Body {

    constructor({ mass, format, x, y, color, speedx, speedy, acelerationx, acelerationy }) {
        this.mass = mass?? 100;
        this.format = format;
        this.x = x?? 0;
        this.y = y?? 0;
        this.color = color?? 'blue';
        this.density = null
        this.speedx = speedx?? 0
        this.speedy = speedy?? 0
        this.acelerationx = acelerationx?? 0
        this.acelerationy = acelerationy?? 0
    }

    set setDensity(density) {
        this.density = density
    }
}


