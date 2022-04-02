export function create<K extends keyof HTMLElementTagNameMap>(selector: K) {
  return document.createElement(selector)
}