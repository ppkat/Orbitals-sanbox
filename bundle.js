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

    function gravity(state, i) {
        const body1 = state[i]
        const previousBody = state[i > 0? i - 1 : state.length - 1]
        previousBody.acelerationx = previousBody.acelerationy = 0 //cleaning previous aceleration

        for (let j = i + 1; j < state.length; j++) {
            const body2 = state[j]

            const gravityConstant = 6.67408 * 10 ** -11
            const mass1 = body1.mass
            const mass2 = body2.mass
            const center1 = body1.format === 'circle' ? { x: body1.x, y: body1.y } : { x: body1.x + body1.width / 2, y: body1.y + body1.height / 2 }
            const center2 = body2.format === 'circle' ? { x: body2.x, y: body2.y } : { x: body2.x + body2.width / 2, y: body2.y + body2.height / 2 }
            const distancex = center1.x - center2.x
            const distancey = center1.y - center2.y

            const distance = Math.sqrt(distancex ** 2 + distancey ** 2) // d┬▓ = (x1 - x2)┬▓ + (y1 - y2)┬▓
            const gravityForce = gravityConstant * mass1 * mass2 / distance ** 2 // F = G * m * m) / d┬▓

            const sin = distancey / distance
            const cos = distancex / distance
            const forcex = gravityForce * cos
            const forcey = gravityForce * sin

            body1.acelerationx += -forcex / mass1 // F = m * a
            body1.acelerationy += -forcey / mass1
            body2.acelerationx += forcex / mass2
            body2.acelerationy += forcey / mass2
        }
    }

    function move(body) {

        body.speedx += body.acelerationx
        body.x += body.speedx
        body.speedy += body.acelerationy
        body.y += body.speedy
    }

    function colision(body1, body2) {

        if (body1.format === 'retangle' && body2.format === 'retangle') {
            if (body1.x <= body2.x + body2.width && body1.x + body1.width >= body2.x && body1.y <= body2.y + body2.width && body1.y + body1.width >= body2.y) {
                body1.speedx = -body1.speedx
                body1.speedy = -body1.speedy
                body2.speedx = -body2.speedx
                body2.speedy = -body2.speedy
            }
        }
        else if (body1.format === 'circle' && body2.format === 'circle') {
            //if(body1.x + body1.width >= body2.x - body2.radius)
        }
        else if ((body1.format === 'circle' && body2.format === 'retangle') || (body1.format === 'retangle' && body2.format === 'circle')) {

        }

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

    createRetangle({ mass: 1 * 10 ** 7, color: 'red', x: 50, y: 200, width: 30, height: 70 })
    createRetangle({ mass: 8 * 10 ** 13, color: 'yellow', x: 400, y: 100, width: 200, height: 170 })
    createRetangle({ mass: 5 * 10 ** 7, color: 'red', x: 200, y: 300, width: 50, height: 75 })
    createCircle({ color: 'brown', mass: 4 * 10 ** 13, x: 800, y: 80, radius: 50, speedx: -7 })
    createCircle({ color: 'purple', mass: 8 * 10 ** 13, x: 50, y: 500, radius: 50, speedx: 3 })
    createCircle({ color: 'blue', mass: 1.1 * 10 ** 14, x: 1000, y: 700, radius: 85, speedx: 0 })
    createRetangle({ mass: 9.01 * 10 ** 13, color: 'pink', x: 750, y: 300, width: 100, height: 90, speedx: 4 })
    createCircle({ color: 'gray', mass: 6 * 10 ** 9, x: 600, y: 800, radius: 8, speedx: 3 })

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

        game.gravity(game.state, i)
        game.move(body)
    }

    game.draw()
    requestAnimationFrame(render)
}
render()
},{"./Class/Circle":2,"./Class/Retangle":3}]},{},[4]);
