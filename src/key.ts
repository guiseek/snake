import { Arrow } from './types/arrow'

export class Key {
  static ArrowUp = false
  static ArrowDown = false
  static ArrowLeft = false
  static ArrowRight = false

  static resetState() {
    Key.ArrowUp = false
    Key.ArrowDown = false
    Key.ArrowLeft = false
    Key.ArrowRight = false
  }

  static listen() {
    addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' && this.ArrowDown) return
        if (e.key === 'ArrowDown' && this.ArrowUp) return
        if (e.key === 'ArrowLeft' && this.ArrowRight) return
        if (e.key === 'ArrowRight' && this.ArrowLeft) return

        const key = e.key as Arrow

        Key[key] = true

        Object.keys(this)
          .filter((f) => f !== e.key && f !== 'listen' && f !== 'resetState')
          .forEach((k) => {
            this[k as Arrow] = false
          })
      },
      false
    )
  }
}
