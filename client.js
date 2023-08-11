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

            const distance = Math.sqrt(distancex ** 2 + distancey ** 2) // d² = (x1 - x2)² + (y1 - y2)²
            const gravityForce = gravityConstant * mass1 * mass2 / distance ** 2 // F = G * m * m) / d²

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

            const distance = Math.sqrt(distancex ** 2 + distancey ** 2) // d² = (x1 - x2)² + (y1 - y2)²
            const gravityForce = gravityConstant * mass1 * mass2 / distance ** 2 // F = G * m * m) / d²

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

                    function nuclearFusion() {
                        if (overlappedDistance > radiusSum / 2.3) {
                            if (body1.mass > body2.mass) {
                                body1.radius = body1.radius + body2.radius / (Math.sqrt(2) * 1.2)
                                body1.mass += body2.mass
                                state.splice(j, 1)
                            }
                            else {
                                body2.radius = body2.radius + body1.radius / (Math.sqrt(2) * 1.2)
                                body2.mass += body1.mass
                                state.splice(i, 1)
                            }

                            console.log('fusion')
                        }
                        // else {
                        //     body1.mass /= 2
                        //     body1.radius /= Math.sqrt(2)
                        //     createParticle({ color: body1.color, mass: body1.mass, x: body1.x - body1.radius, y: body1.y + body1.radius, radius: body1.radius })
                        //     console.log('new particle')
                        // }
                    }

                    //nuclearFusion()
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

        function border() {
            if (body1.color === 'blue') {
                return setInterval(() => state.splice(i, 1), 2000)
            }
            if (body1.x <= 0) {
                body1.x = 0
                body1.speedx = -body1.speedx
            }
            else if (body1.x >= canvas.width) {
                body1.x = canvas.width
                body1.speedx = -body1.speedx
            }
            else if (body1.y <= 0) {
                body1.y = 0
                body1.speedy = -body1.speedy
            }
            else if (body1.y >= canvas.height) {
                body1.y = canvas.height
                body1.speedy = -body1.speedy
            }
        }

        //border()
    }

    function draw() {

        //black painting
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let body of game.state) {
            ctx.fillStyle = body.color
            ctx.beginPath()
            ctx.arc(body.x, body.y, body.radius, 0, 2 * Math.PI)
            ctx.fill()
        }
    }

    const scale = 2.5 * 10 ** 8

    // const Sun = createParticle({ color: 'yellow', mass: (1.989 * 10 ** 30) / (scale ** 2), x: canvas.width / 2, y: canvas.height / 2, radius: (6.9634 * 10 ** 8) / scale })
    // const Earth = createParticle({ color: '#0099ff', mass: (5.97 * 10 ** 24) / (scale ** 2), x: canvas.width / 2 + (149.6 * 10 ** 9) / scale, y: canvas.height / 2, radius: (6.371 * 10 ** 6) / scale, speedx: -1.33211 * 10 ** 1, speedy: 0 })
    // const moon = createParticle({ color: 'silver', mass: (7.35 * 10 ** 22) / (scale ** 2), x: canvas.width / 2 + (154 * 10 ** 9 + 384.4 * 10 ** 6) / scale, y: canvas.height, radius: 1.737 * 10 ** 6) / scale, speedx: 1082, speedy: 0 })

    const Sunx2 = createParticle({ color: 'black', mass: (1.989 * 10 ** 31) / (scale ** 2), x: canvas.width / 2, y: canvas.height / 2, radius: 60 })
    // const Earthx2 = createParticle({ color: '#0099ff', mass: (5.97 * 10 ** 24) / (scale ** 2), x: canvas.width / 2 + (154 * 10 ** 9) / scale, y: canvas.height / 2, radius: 3, speedx: 0, speedy: 0.29290 * 5 })
    // const moonx2 = createParticle({ color: 'silver', mass: (7.35 * 10 ** 22) / (scale ** 2), x: canvas.width / 2 + (154 * 10 ** 9 + 384.4 * 10 ** 6) / scale, y: canvas.height / 2, radius: 1, speedx: 0, speedy: (29290 + 1082) / scale })

    //light
    // for (i = 0; i < 700; i++) {
    //     createParticle({ color: 'yellow', mass: 1, x: -5000 + i * 8, y: 30, radius: 3, speedx: 5 })
    // }

    // for (i = 0; i < 700; i++) {
    //     createParticle({ color: 'yellow', mass: 1, x: -5000 + i * 8, y: canvas.height - 30, radius: 3, speedx: 5 })
    // }

    setInterval(() => {
        createParticle({ color: 'yellow', mass: 1, x: 0, y: 30, radius: 3, speedx: 5 })
    }, 31)
    setInterval(() => {
        createParticle({ color: 'yellow', mass: 1, x: 0, y: canvas.height - 30, radius: 3, speedx: 5 })
    }, 31)


    //gasses planets
    // for (i = 0; i < 200; i++) {
    //     createParticle({ color: 'yellow', mass: 4 * 10 ** 10, x: -600 + i * 12, y: canvas.height / 2, radius: 6, speedx: 0 })
    // }
    // for (i = 0; i < 200; i++) {
    //     createParticle({ color: 'red', mass: 2 * 10 ** 10, x: -600 + i * 12, y: canvas.height / 2 + 100, radius: 5, speedx: 0 })
    // }
    // for (i = 0; i < 200; i++) {
    //     createParticle({ color: 'red', mass: 2 * 10 ** 10, x: -600 + i * 12, y: canvas.height / 2 - 100, radius: 5, speedx: 0 })
    // }
    // for (i = 0; i < 200; i++) {
    //     createParticle({ color: 'blue', mass: 3 * 10 ** 10, x: -600 + i * 12, y: canvas.height / 2 - 200, radius: 4, speedx: 0 })
    // }
    // for (i = 0; i < 200; i++) {
    //     createParticle({ color: 'blue', mass: 3 * 10 ** 10, x: -600 + i * 12, y: canvas.height / 2 + 200, radius: 4, speedx: 0 })
    // }


    //gasses

    // for (i = 0; i < canvas.width; i += 100) {
    //     for (j = 0; j < canvas.height; j += 60)
    //         createParticle({ color: 'gray', mass: 8 * 10 ** 10, x: i, y: j, radius: 12 })
    //     for (j = 20; j < canvas.height; j += 60)
    //         createParticle({ color: 'red', mass: 4 * 10 ** 10, x: i, y: j, radius: 10 })
    //     for (j = 32; j < canvas.height; j += 60)
    //         createParticle({ color: 'pink', mass: 2 * 10 ** 10, x: i, y: j, radius: 8 })
    //     for (j = 44; j < canvas.height; j += 60)
    //         createParticle({ color: 'blue', mass: 1 * 10 ** 10, x: i, y: j, radius: 6 })
    // }

    // for (i = 30; i < canvas.width; i += 60) {
    //     for (j = 0; j < canvas.height; j += 60)
    //         createParticle({ color: 'black', mass: 5 * 10 ** 9, x: i, y: j, radius: 4 })
    // }

    // setTimeout(() => {
    //     let counter = 0
    //     setInterval(() => {

    //         if (counter < 300) {
    //             canvas.width -= 3.1
    //             canvas.height -= 2
    //         } else if (counter < 600) {

    //         } else if (counter < 1100) {
    //             canvas.height += 3
    //             canvas.width += 2.5
    //         } else {

    //         }
    //         counter++
    //     }, 60)
    // }, 5000)

    //waves
    // for (i = 0; i < 30; i++) {
    //     for (j = 0; j < 20; j++) {
    //         createParticle({ color: 'black', mass: 1, x: i * 10, y: 400 + j * 10, radius: 4, speedx: 3 })

    //     }
    // }
    // for (i = 0; i < 30; i++) {
    //     for (j = 0; j < 20; j++) {
    //         createParticle({ color: 'black', mass: 1, x: i * 10 + 400, y: 400 + j * 10, radius: 4, speedx: 1 })

    //     }
    // }

    // for (i = canvas.width; i > 0; i -= 55) {
    //     for (j = canvas.height; j > 0; j -= 55) {
    //         createParticle({ color: 'black', mass: 10 ** 12, x: i, y: j, radius: 15, speedx: 0 })
    //     }
    // }

    // for (i = canvas.height / 2; i > 0; i -= 55) {
    //     createParticle({ color: 'blue', mass: 1, x: -50, y: i * 2, radius: 25, speedx: 1 })
    // }

    // for (i = canvas.width / 2; i > 0; i -= 55) {
    //     createParticle({ color: 'blue', mass: 1, x: i, y: canvas.height + 50, radius: 25, speedy: 1 })
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

let counter = 0
function render() {

    //game.gravityOnlyFirstBody()
    //counter++
    for (let i = 0; i < game.state.length; i++) {
        const body = game.state[i]

        game.gravity(game.state, i)
        game.colision(game.state, i)
        game.move(body)
    }

    // if (counter === 30) {
    //     game.createParticle({ color: 'gray', mass: 1 * 10 ** 10, x: canvas.width / 2, y: canvas.height / 2, radius: 10 })
    //     counter = 0
    // }
    game.draw()
    requestAnimationFrame(render)
}
ctx.fillRect(0, 0, canvas.width, canvas.height)
render()