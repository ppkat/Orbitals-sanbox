const Body = require("./Body")

module.exports = class Circle extends Body {

    constructor({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, radius) {
        super({mass, density: null, format: 'circle', x, y, color, speedx, speedy, acelerationx, acelerationy})
        this.radius = radius
        this.area = 2 * Math.PI * this.radius
        
        this.setDensity = this.mass / this.area

    }
}
