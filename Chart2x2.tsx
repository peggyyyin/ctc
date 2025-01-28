import type React from "react"
import { useEffect, useRef } from "react"

interface Chart2x2Props {
  xSum: number
  ySum: number
}

const Chart2x2: React.FC<Chart2x2Props> = ({ xSum, ySum }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw grid
        ctx.strokeStyle = "#152e65"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2, 0)
        ctx.lineTo(canvas.width / 2, canvas.height)
        ctx.moveTo(0, canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()

        // Draw axis labels
        ctx.fillStyle = "#000000"
        ctx.font = "bold 14px Rubik"
        ctx.textAlign = "center"

        // Y-axis labels
        ctx.save()
        ctx.translate(20, canvas.height / 4)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText("FLEXIBLE", 0, 0)
        ctx.restore()

        ctx.save()
        ctx.translate(20, (3 * canvas.height) / 4)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText("FIXED", 0, 0)
        ctx.restore()

        // X-axis labels
        ctx.fillText("RELATIONAL", canvas.width / 4, canvas.height - 30)
        ctx.fillText("INSTITUTIONAL", (3 * canvas.width) / 4, canvas.height - 30)

        // Draw quadrant labels
        ctx.fillText("Bridge Builder", canvas.width * 0.75, 20)
        ctx.fillText("Trail Guide", canvas.width * 0.25, 20)
        ctx.fillText("Map Maker", canvas.width * 0.25, canvas.height - 10)
        ctx.fillText("Transport Helicopter", canvas.width * 0.75, canvas.height - 10)

        // Plot result
        ctx.fillStyle = "#40c7cc"
        ctx.beginPath()
        const x = (xSum / 12 + 1) * (canvas.width / 2)
        const y = (1 - ySum / 12) * (canvas.height / 2)
        ctx.arc(x, y, 8, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }, [xSum, ySum])

  return <canvas ref={canvasRef} width={300} height={300} className="border-2 border-primary rounded-lg" />
}

export default Chart2x2

