export function hsl2rgb(hue: number, saturation: number, lightness: number) {
  if (hue == undefined) {
    return [0, 0, 0]
  }

  let chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  let huePrime = hue / 60
  let secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1))

  huePrime = ~~huePrime
  
  let red: number
  let green: number
  let blue: number

  if (huePrime === 0) {
    red = chroma
    green = secondComponent
    blue = 0
  } else if (huePrime === 1) {
    red = secondComponent
    green = chroma
    blue = 0
  } else if (huePrime === 2) {
    red = 0
    green = chroma
    blue = secondComponent
  } else if (huePrime === 3) {
    red = 0
    green = secondComponent
    blue = chroma
  } else if (huePrime === 4) {
    red = secondComponent
    green = 0
    blue = chroma
  } else if (huePrime === 5) {
    red = chroma
    green = 0
    blue = secondComponent
  } else {
    red = 0
    green = 0
    blue = 0
  }

  let lightnessAdjustment = lightness - chroma / 2
  red += lightnessAdjustment
  green += lightnessAdjustment
  blue += lightnessAdjustment

  return [
    Math.round(red * 255),
    Math.round(green * 255),
    Math.round(blue * 255),
  ]
}