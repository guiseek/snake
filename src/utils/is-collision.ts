import { Vector } from '../vector'

export function isCollision(v1: Vector, v2: Vector) {
  return v1.x == v2.x && v1.y == v2.y
}
