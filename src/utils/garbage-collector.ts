import { Particle } from "../particle";

export function garbageCollector(particles: Particle[]) {
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].size <= 0) {
      particles.splice(i, 1)
    }
  }
}