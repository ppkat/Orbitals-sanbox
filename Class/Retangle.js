const Body = require("./Body")

module.exports = class Retangle extends Body {

    constructor({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, width, height) {
        super({mass, density: null, format: 'retangle', x, y, color, speedx, speedy, acelerationx, acelerationy})
        this.width = width
        this.height = height

        this.setDensity = this.mass / (this.height * this.width)

    }
}
