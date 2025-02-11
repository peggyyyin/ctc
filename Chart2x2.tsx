import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Chart2x2Props {
  xSum: number;
  ySum: number;
}

const Chart2x2: React.FC<Chart2x2Props> = ({ xSum, ySum }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parentWidth = canvasRef.current.parentElement?.offsetWidth || window.innerWidth; // Use window size if parent width is unavailable
        const parentHeight = parentWidth * 0.75; // Maintain aspect ratio (3:4)
        setCanvasSize({ width: parentWidth, height: parentHeight });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call immediately to set initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Redraw chart when canvas size or data changes
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate font size based on canvas width
        const fontSize = canvas.width * 0.025;  // 2.5% of the canvas width
        ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Define border dimensions
        const borderScale = 0.8;
        const borderWidth = canvas.width * borderScale;
        const borderHeight = canvas.height * borderScale;
        const offsetX = (canvas.width - borderWidth) / 2;
        const offsetY = (canvas.height - borderHeight) / 2;

        ctx.strokeStyle = "#152e65";
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, borderWidth, borderHeight);

        // Draw grid lines
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, offsetY);
        ctx.lineTo(canvas.width / 2, offsetY + borderHeight);
        ctx.moveTo(offsetX, canvas.height / 2);
        ctx.lineTo(offsetX + borderWidth, canvas.height / 2);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = "#000000";
        ctx.fillText("FLEXIBLE", canvas.width / 2, offsetY - fontSize);
        ctx.fillText("FIXED", canvas.width / 2, offsetY + borderHeight + fontSize);
        ctx.save();
        ctx.translate(offsetX - fontSize / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("RELATIONAL", 0, 0);
        ctx.restore();

        ctx.save();
        ctx.translate(offsetX + borderWidth + fontSize / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText("INSTITUTIONAL", 0, 0);
        ctx.restore();

        // Quadrant labels
        ctx.fillText("Trail Guides", offsetX + borderWidth * 0.25, offsetY + fontSize);
        ctx.fillText("Bridge Builders", offsetX + borderWidth * 0.75, offsetY + fontSize);
        ctx.fillText("Mapmakers", offsetX + borderWidth * 0.25, offsetY + borderHeight - fontSize);
        ctx.fillText("Transport Helicopters", offsetX + borderWidth * 0.75, offsetY + borderHeight - fontSize);

        // Plot result
        ctx.fillStyle = "#40c7cc";
        ctx.beginPath();
        const x = offsetX + ((xSum / 12 + 1) * (borderWidth / 2));
        const y = offsetY + ((1 - ySum / 12) * (borderHeight / 2));
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [xSum, ySum, canvasSize]); // Redraw when data or canvas size changes

  return (
    <div className="justify-center mb-6">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}  // Responsive width
        height={canvasSize.height}  // Responsive height
        className="border-2 border-transparent rounded-lg"
        style={{
          width: '100%',  // Ensures full width of the container
          height: 'auto', // Maintains the aspect ratio
        }}
      />
    </div>
  );
};

export default Chart2x2;
