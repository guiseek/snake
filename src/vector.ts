export class Vector {
  constructor(public x: number, public y: number) {}

  add(v: Vector) {
    this.x += v.x
    this.y += v.y
    return this
  }
  
  mult(v: Vector) {
    if (v instanceof Vector) {
      this.x *= v.x
      this.y *= v.y
      return this
    } else {
      this.x *= v
      this.y *= v
      return this
    }
  }
}