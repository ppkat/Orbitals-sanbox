(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



},{}],2:[function(require,module,exports){
const Body = require("./Body")

module.exports = class Circle extends Body {

    constructor({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, radius) {
        super({mass, density: null, format: 'circle', x, y, color, speedx, speedy, acelerationx, acelerationy})
        this.radius = radius
        this.area = 2 * Math.PI * this.radius
        
        this.setDensity = this.mass / this.area

    }
}

},{"./Body":1}],3:[function(require,module,exports){
const Body = require("./Body")

module.exports = class Retangle extends Body {

    constructor({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, width, height) {
        super({mass, density: null, format: 'retangle', x, y, color, speedx, speedy, acelerationx, acelerationy})
        this.width = width
        this.height = height

        this.setDensity = this.mass / (this.height * this.width)

    }
}

},{"./Body":1}],4:[function(require,module,exports){
const Circle = require("./Class/Circle")
const Retangle = require("./Class/Retangle")

const vw = document.documentElement.clientWidth
const vh = document.documentElement.clientHeight
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.width = vw * 8 / 10
canvas.height = vh * 8 / 10
canvas.style.border = '1px solid'
document.body.appendChild(canvas)

function createGame() {
    const state = []

    function createRetangle({ mass, color, x, y, width, height, speedx, speedy, acelerationx, acelerationy }) {
        const retangle = new Retangle({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, width, height)
        state.push(retangle)
    }

    function createCircle({ mass, color, x, y, radius, speedx, speedy, acelerationx, acelerationy }) {
        const circle = new Circle({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, radius)
        state.push(circle)
    }

    function gravity(body1, body2) {

        console.log(body1, body2)
        const gravityConstant = 6.67408 * 10 ** -11
        const mass1 = body1.mass
        const mass2 = body2.mass
        const center1 = body1.format === 'circle' ? { x: body1.x, y: body1.y } : { x: body1.x + body1.width / 2, y: body1.y + body1.height / 2 }
        const center2 = body2.format === 'circle' ? { x: body2.x, y: body2.y } : { x: body2.x + body2.width / 2, y: body2.y + body2.height / 2 }
        const distancex = center1.x - center2.x
        const distancey = center1.y - center2.y

        const distance = Math.sqrt(distancex ** 2 + distancey ** 2) // d┬▓ = (x1 - x2)┬▓ + (y1 - y2)┬▓
        const gravityForce = /*gravityConstant*/ mass1 * mass2 / distance ** 2 // F = G * m * m) / d┬▓

        const sin = distancey / distance
        const cos = distancex / distance
        const forcex = gravityForce * cos
        const forcey = gravityForce * sin

        body1.acelerationx = -forcex / mass1 // F = m * a
        body1.acelerationy = -forcey / mass1
        body2.acelerationx = forcex / mass2
        body2.acelerationy = forcey / mass2

    }

    function move(body) {

        body.speedx += body.acelerationx
        body.x += body.speedx
        body.speedy += body.acelerationy
        body.y += body.speedy
    }

    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let body of game.state) {
            ctx.fillStyle = body.color
            if (body.format === 'retangle') {
                ctx.fillRect(body.x, body.y, body.width, body.height)
            } else {
                ctx.beginPath()
                ctx.arc(body.x, body.y, body.radius, 0, 2 * Math.PI)
                ctx.fill()
            }
        }
    }

    createRetangle({ mass: 1000, color: 'red', x: 50, y: 200, width: 30, height: 70 })
    createRetangle({ mass: 800000000, color: 'yellow', x: 400, y: 100, width: 200, height: 170 })
    createRetangle({ mass: 5000, color: 'red', x: 200, y: 300, width: 50, height: 75 })
    createCircle({ color: 'brown', mass: 4000, x: 800, y: 80, radius: 70, speedx: -5 })
    createCircle({ color: 'purple', mass: 8000, x: 50, y: 500, radius: 70 })

    return {
        state,
        createCircle,
        createRetangle,
        move,
        gravity,
        draw
    }
}

const game = createGame()

function render() {

    for (let i = 0; i < game.state.length; i++) {
        const body = game.state[i]

        for (let j = i + 1; j < game.state.length; j++) {
            const body2 = game.state[j]
            game.gravity(body, body2)
        }

        game.move(body)
    }

    game.draw()
    requestAnimationFrame(render)
}
render()
},{"./Class/Circle":2,"./Class/Retangle":3}]},{},[4]);
