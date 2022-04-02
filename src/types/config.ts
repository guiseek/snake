import { Particle } from '../particle'

export interface Config {
  ctx: CanvasRenderingContext2D
  currentHue: string
  cells: number
  cellSize: number
  isGameOver: boolean
  score: number
  maxScore: number
  particles: Particle[]
  splashingParticleCount: number
  requestID: number
}