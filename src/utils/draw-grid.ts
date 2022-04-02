export function drawGrid(ctx: CanvasRenderingContext2D, cells: number, width: number, height: number) {
  ctx.lineWidth = 1.1
  ctx.strokeStyle = '#232332'
  ctx.shadowBlur = 0
  
  for (let i = 1; i < cells; i++) {
    let f = (width / cells) * i
    ctx.beginPath()
    ctx.moveTo(f, 0)
    ctx.lineTo(f, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, f)
    ctx.lineTo(width, f)
    ctx.stroke()
    ctx.closePath()
  }
}