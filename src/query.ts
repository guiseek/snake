export function query<K extends keyof HTMLElementTagNameMap>(
  selector: K,
  parent?: HTMLElement
): HTMLElementTagNameMap[K]

export function query<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent?: HTMLElement
): HTMLElementTagNameMap[K]

export function query<K extends keyof HTMLElementTagNameMap>(
  selector: K | string,
  parent: HTMLElement = document.body
) {
  return parent.querySelector(selector)
}

export function queryAll<K extends keyof HTMLElementTagNameMap>(
  selector: K,
  parent?: HTMLElement
): NodeListOf<HTMLElementTagNameMap[K]>

export function queryAll<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent?: HTMLElement
): NodeListOf<HTMLElementTagNameMap[K]>

export function queryAll<K extends keyof HTMLElementTagNameMap>(
  selector: K | string,
  parent: HTMLElement = document.body
) {
  return parent.querySelectorAll(selector)
}

