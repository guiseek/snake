import { hsl2rgb } from './utils/hsl-to-rgb'
import { Vector } from './vector'

export class Particle {
  ttl = 0

  gravity = -0.2

  constructor(
    public pos: Vector,
    public color: string,
    public size: number,
    public vel: Vector,
  ) {
    this.size = Math.abs(size / 2)
  }

  draw(ctx: CanvasRenderingContext2D) {
    let { x, y } = this.pos
    let hsl = this.color
      .split('')
      .filter((l) => l.match(/[^hsl()$% ]/g))
      .join('')
      .split(',')
      .map((n) => +n)

    let [r, g, b] = hsl2rgb(hsl[0], hsl[1] / 100, hsl[2] / 100)

    ctx.shadowColor = `rgb(${r},${g},${b},${1})`
    ctx.shadowBlur = 0
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = `rgb(${r},${g},${b},${1})`
    ctx.fillRect(x, y, this.size, this.size)
    ctx.globalCompositeOperation = 'source-over'
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx)
    this.size -= 0.3
    this.ttl += 1
    this.pos.add(this.vel)
    this.vel.y -= this.gravity
  }
}
