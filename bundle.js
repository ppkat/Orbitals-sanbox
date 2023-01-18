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
        super({ mass, density: null, x, y, color, speedx, speedy, acelerationx, acelerationy })
        this.radius = radius
        this.area = 2 * Math.PI * this.radius

        this.setDensity = this.mass / this.area

    }
}

},{"./Body":1}],3:[function(require,module,exports){
const Particle = require("./Class/Particle")

const vw = document.documentElement.clientWidth
const vh = document.documentElement.clientHeight
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.width = vw * 9 / 10
canvas.height = vh * 9 / 10
canvas.style.border = '1px solid'
canvas.style.imageRendering = 'pixalated'
document.body.appendChild(canvas)
let test = true

function createGame() {
    const state = []

    function createParticle({ mass, color, x, y, radius, speedx, speedy, acelerationx, acelerationy }) {
        const particle = new Particle({ mass, color, x, y, speedx, speedy, acelerationx, acelerationy }, radius)
        state.push(particle)
    }

    function gravity(state, i) {
        const body1 = state[i]
        const previousBody = state[i > 0 ? i - 1 : state.length - 1]
        previousBody.acelerationx = previousBody.acelerationy = 0 //cleaning previous aceleration

        for (let j = i + 1; j < state.length; j++) {
            const body2 = state[j]

            const gravityConstant = 6.67408 * 10 ** -11
            const mass1 = body1.mass
            const mass2 = body2.mass
            const center1 = { x: body1.x, y: body1.y }
            const center2 = { x: body2.x, y: body2.y }
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

    function gravityOnlyFirstBody() {

        const body1 = game.state[0]
        body1.acelerationx = body1.acelerationy = 0
        for (i = 1; i < game.state.length; i++) {
            const body2 = game.state[i]
            const gravityConstant = 6.67408 * 10 ** -11
            const mass1 = body1.mass
            const mass2 = body2.mass
            const center1 = { x: body1.x, y: body1.y }
            const center2 = { x: body2.x, y: body2.y }
            const distancex = center1.x - center2.x
            const distancey = center1.y - center2.y

            const distance = Math.sqrt(distancex ** 2 + distancey ** 2) // d┬▓ = (x1 - x2)┬▓ + (y1 - y2)┬▓
            const gravityForce = gravityConstant * mass1 * mass2 / distance ** 2 // F = G * m * m) / d┬▓

            const sin = distancey / distance
            const cos = distancex / distance
            const forcex = gravityForce * cos
            const forcey = gravityForce * sin

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

    function colision(state, i) {
        const body1 = state[i]

        for (let j = i + 1; j < state.length; j++) {
            const body2 = state[j]

            const radiusSum = body1.radius + body2.radius
            let distancex = body1.x - body2.x
            let distancey = body1.y - body2.y
            let distance = Math.hypot(distancex, distancey)

            if (distance <= radiusSum) {
                const sinFi = distancey / distance //Fi is the angle between x axis and colision center particles axis
                const cosFi = distancex / distance

                function removeOverlap() {
                    const overlappedDistance = (radiusSum - distance) / 2;
                    const massSum = body1.mass + body2.mass
                    const inverseProportionality1 = body2.mass * 2 / massSum
                    const inverseProportionality2 = body1.mass * 2 / massSum

                    body1.x += overlappedDistance * cosFi * inverseProportionality1
                    body1.y += overlappedDistance * sinFi * inverseProportionality1
                    body2.x -= overlappedDistance * cosFi * inverseProportionality2
                    body2.y -= overlappedDistance * sinFi * inverseProportionality2

                    distance += overlappedDistance

                    distancex = distance * cosFi
                    distancey = distance * sinFi
                    console.log('overlaped')
                }

                const isOverlap = distance < radiusSum
                if (isOverlap) removeOverlap()

                body1.colisionAxisSpeed = body1.speedx * cosFi + body1.speedy * sinFi
                body1.complementarColisionAxisSpeed = -body1.speedx * sinFi + body1.speedy * cosFi
                body2.colisionAxisSpeed = body2.speedx * cosFi + body2.speedy * sinFi
                body2.complementarColisionAxisSpeed = -body2.speedx * sinFi + body2.speedy * cosFi

                const newSpeed1 = ((body1.mass - body2.mass) * body1.colisionAxisSpeed + 2 * body2.mass * body2.colisionAxisSpeed) / (body1.mass + body2.mass)
                const newSpeed2 = ((body2.mass - body1.mass) * body2.colisionAxisSpeed + 2 * body1.mass * body1.colisionAxisSpeed) / (body1.mass + body2.mass)

                body1.speedx = newSpeed1 * cosFi - body1.complementarColisionAxisSpeed * sinFi
                body1.speedy = newSpeed1 * sinFi + body1.complementarColisionAxisSpeed * cosFi
                body2.speedx = newSpeed2 * cosFi - body2.complementarColisionAxisSpeed * sinFi
                body2.speedy = newSpeed2 * sinFi + body2.complementarColisionAxisSpeed * cosFi
            }
        }

        // if (body1.x <= 0) {
        //     body1.x = 0
        //     body1.speedx = -body1.speedx
        // }
        // else if (body1.x >= canvas.width) {
        //     body1.x = canvas.width
        //     body1.speedx = -body1.speedx
        // }
        // else if (body1.y <= 0) {
        //     body1.y = 0
        //     body1.speedy = -body1.speedy
        // }
        // else if (body1.y >= canvas.height) {
        //     body1.y = canvas.height
        //     body1.speedy = -body1.speedy
        // }
    }

    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let body of game.state) {
            ctx.fillStyle = body.color
            ctx.beginPath()
            ctx.arc(body.x, body.y, body.radius, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
    // createParticle({ color: 'aqua', mass: 5.9722 * 10 ** 12, x: canvas.width / 2, y: canvas.height / 2, radius: 90, speedx: 0, speedy: 0 })
    // createParticle({ color: 'blue', mass: 3 * 10 ** 10, x: 1000, y: 700, radius: 15, speedx: 0 })
    // createParticle({ color: 'brown', mass: 8 * 10 ** 8, x: 800, y: 80, radius: 6, speedx: 2 })
    // createParticle({ color: 'purple', mass: 6 * 10 ** 9, x: 800, y: 500, radius: 10, speedx: 5 })
    // createParticle({ color: 'red', mass: 1 * 10 ** 10, x: 700, y: 500, radius: 12, speedx: -2 })
    // createParticle({ color: 'gray', mass: 8 * 10 ** 11, x: 600, y: 400, radius: 40, speedx: 0, speedy: 2 })
    // createParticle({ color: 'pink', mass: 4 * 10 ** 8, x: 100, y: 900, radius: 4, speedx: 0, speedy: 7 })


    for (i = 0; i < canvas.width; i += 100) {
        for (j = 0; j < canvas.height; j += 60)
            createParticle({ color: 'gray', mass: 8 * 10 ** 10, x: i, y: j, radius: 10 })
        for (j = 20; j < canvas.height; j += 60)
            createParticle({ color: 'red', mass: 6 * 10 ** 10, x: i, y: j, radius: 8 })
        // for (j = 32; j < canvas.height; j += 60)
        //     createParticle({ color: 'pink', mass: 4 * 10 ** 10, x: i, y: j, radius: 6 })
        // for (j = 44; j < canvas.height; j += 60)
        //     createParticle({ color: 'blue', mass: 2 * 10 ** 10, x: i, y: j, radius: 4 })
    }

    // for (i = 30; i < canvas.width; i += 100) {
    //     for (j = 0; j < canvas.height; j += 60)
    //         createParticle({ color: 'black', mass: 2 * 10 ** 8, x: i, y: j, radius: 2 })
    // }

    return {
        state,
        createParticle,
        move,
        gravity,
        gravityOnlyFirstBody,
        draw,
        colision
    }
}

const game = createGame()

function render() {

    //game.gravityOnlyFirstBody()
    for (let i = 0; i < game.state.length; i++) {
        const body = game.state[i]

        game.gravity(game.state, i)
        game.colision(game.state, i)
        game.move(body)
    }

    game.draw()
    requestAnimationFrame(render)
}
render()
},{"./Class/Particle":2}]},{},[3]);
