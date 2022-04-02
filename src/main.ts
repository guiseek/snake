import { garbageCollector } from './utils/garbage-collector'
import { isCollision } from './utils/is-collision'
import { drawGrid } from './utils/draw-grid'
import { hsl2rgb } from './utils/hsl-to-rgb'
import { randHue } from './utils/rand-hue'
import { Particle } from './particle'
import { create } from './create'
import { Vector } from './vector'
import { query } from './query'
import { Key } from './key'

import './style.scss'
import { Config } from './types/config'

let domScore = query('#score')
let domReplay = query('#replay')
let domCanvas = create('canvas')

query('#canvas').appendChild(domCanvas)

const WIDTH = (domCanvas.width = 600)
const HEIGHT = (domCanvas.height = 600)

let snake: Snake
let food: Food

const config: Config = {
  ctx: domCanvas.getContext('2d')!,
  currentHue: '',
  cells: 20,
  cellSize: 0,
  isGameOver: false,
  score: 0,
  maxScore: parseInt(localStorage.getItem('maxScore') + '') ?? 0,
  particles: [],
  splashingParticleCount: 20,
  requestID: 0,
}

let helpers = { isCollision, garbageCollector, drawGrid, randHue, hsl2rgb }

class Snake {
  pos = new Vector(WIDTH / 2, HEIGHT / 2)
  dir = new Vector(0, 0)
  delay = 5
  size = WIDTH / config.cells
  color = 'white'
  history: Vector[] = []
  total = 1

  constructor(public index?: number, public type?: string) {}

  draw() {
    let { x, y } = this.pos
    config.ctx.fillStyle = this.color
    config.ctx.shadowBlur = 20
    config.ctx.shadowColor = 'rgba(255,255,255,.3 )'
    config.ctx.fillRect(x, y, this.size, this.size)
    config.ctx.shadowBlur = 0
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i]
        config.ctx.lineWidth = 1
        config.ctx.fillStyle = 'rgba(225,225,225,1)'
        config.ctx.fillRect(x, y, this.size, this.size)
      }
    }
  }

  walls() {
    let { x, y } = this.pos
    if (x + config.cellSize > WIDTH) {
      this.pos.x = 0
    }
    if (y + config.cellSize > WIDTH) {
      this.pos.y = 0
    }
    if (y < 0) {
      this.pos.y = HEIGHT - config.cellSize
    }
    if (x < 0) {
      this.pos.x = WIDTH - config.cellSize
    }
  }

  controlls() {
    let dir = this.size
    if (Key.ArrowUp) {
      this.dir = new Vector(0, -dir)
    }
    if (Key.ArrowDown) {
      this.dir = new Vector(0, dir)
    }
    if (Key.ArrowLeft) {
      this.dir = new Vector(-dir, 0)
    }
    if (Key.ArrowRight) {
      this.dir = new Vector(dir, 0)
    }
  }
  selfCollision() {
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i]
      if (helpers.isCollision(this.pos, p)) {
        config.isGameOver = true
      }
    }
  }
  update() {
    this.walls()
    this.draw()
    this.controlls()
    if (!this.delay--) {
      if (helpers.isCollision(this.pos, food.pos)) {
        incrementScore()
        particleSplash()
        food.spawn()
        this.total++
      }
      this.history[this.total - 1] = new Vector(this.pos.x, this.pos.y)
      for (let i = 0; i < this.total - 1; i++) {
        this.history[i] = this.history[i + 1]
      }
      this.pos.add(this.dir)
      this.delay = 5
      this.total > 3 ? this.selfCollision() : null
    }
  }
}

class Food {
  pos = new Vector(
    ~~(Math.random() * config.cells) * config.cellSize,
    ~~(Math.random() * config.cells) * config.cellSize
  )

  color = (config.currentHue = `hsl(${~~(Math.random() * 360)},100%,50%)`)

  size = config.cellSize

  constructor() {}
  draw() {
    let { x, y } = this.pos
    config.ctx.globalCompositeOperation = 'lighter'
    config.ctx.shadowBlur = 20
    config.ctx.shadowColor = this.color
    config.ctx.fillStyle = this.color
    config.ctx.fillRect(x, y, this.size, this.size)
    config.ctx.globalCompositeOperation = 'source-over'
    config.ctx.shadowBlur = 0
  }

  spawn(): void {
    let randX = ~~(Math.random() * config.cells) * this.size
    let randY = ~~(Math.random() * config.cells) * this.size
    for (let path of snake.history) {
      if (helpers.isCollision(new Vector(randX, randY), path)) {
        return this.spawn()
      }
    }
    this.color = config.currentHue = `hsl(${helpers.randHue()}, 100%, 50%)`
    this.pos = new Vector(randX, randY)
  }
}

function incrementScore() {
  config.score++
  domScore.innerText = config.score.toString().padStart(2, '0')
}

function particleSplash() {
  for (let i = 0; i < config.splashingParticleCount; i++) {
    let vel = new Vector(Math.random() * 6 - 3, Math.random() * 6 - 3)
    let position = new Vector(food.pos.x, food.pos.y)
    config.particles.push(
      new Particle(position, config.currentHue, food.size, vel)
    )
  }
}

function clear() {
  config.ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

const initialize = () => {
  config.ctx.imageSmoothingEnabled = false
  Key.listen()
  // cellsCount = cells * cells
  config.cellSize = WIDTH / config.cells
  snake = new Snake()
  food = new Food()
  domReplay.addEventListener('click', reset, false)
  loop()
}

function loop() {
  clear()
  if (!config.isGameOver) {
    config.requestID = window.setTimeout(loop, 1000 / 60)
    helpers.drawGrid(config.ctx, config.cells, WIDTH, HEIGHT)
    snake.update()
    food.draw()
    for (let p of config.particles) {
      p.update(config.ctx)
    }
    helpers.garbageCollector(config.particles)
  } else {
    clear()
    gameOver()
  }
}

function gameOver() {
  config.maxScore ? null : (config.maxScore = config.score)
  config.score > config.maxScore ? (config.maxScore = config.score) : null
  window.localStorage.setItem('config.maxScore', `${config.maxScore}`)
  config.ctx.fillStyle = '#4cffd7'
  config.ctx.textAlign = 'center'
  config.ctx.font = 'bold 30px Poppins, sans-serif'
  config.ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2)
  config.ctx.font = '15px Poppins, sans-serif'
  config.ctx.fillText(`SCORE   ${config.score}`, WIDTH / 2, HEIGHT / 2 + 60)
  config.ctx.fillText(
    `MAXSCORE   ${config.maxScore}`,
    WIDTH / 2,
    HEIGHT / 2 + 80
  )
}

function reset() {
  domScore.innerText = '00'
  config.score = 0
  snake = new Snake()
  food.spawn()
  Key.resetState()
  config.isGameOver = false
  clearTimeout(config.requestID)
  loop()
}

initialize()
