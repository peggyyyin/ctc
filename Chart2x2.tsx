import type React from "react";
import { useEffect, useRef } from "react";

interface Chart2x2Props {
  xSum: number;
  ySum: number;
}

const Chart2x2: React.FC<Chart2x2Props> = ({ xSum, ySum }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Set font to sans-serif for everything
        ctx.font = "bold 10px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
  
        // Draw border that's 80% of the canvas
        const borderScale = 0.8; // 80% of the canvas
        const borderWidth = canvas.width * borderScale;
        const borderHeight = canvas.height * borderScale;
        const offsetX = (canvas.width - borderWidth) / 2; // Center horizontally
        const offsetY = (canvas.height - borderHeight) / 2; // Center vertically
  
        ctx.strokeStyle = "#152e65";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          offsetX,  // X-coordinate (centered)
          offsetY,  // Y-coordinate (centered)
          borderWidth, // Width of the border
          borderHeight // Height of the border
        );
  
        // Draw grid (inside the border)
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, offsetY); // Y-axis (top to bottom)
        ctx.lineTo(canvas.width / 2, offsetY + borderHeight);
        ctx.moveTo(offsetX, canvas.height / 2); // X-axis (left to right)
        ctx.lineTo(offsetX + borderWidth, canvas.height / 2);
        ctx.stroke();
  
        // Draw axis labels (outside the border)
        ctx.fillStyle = "#000000";
  
        // Y-axis labels
        ctx.save();
        ctx.translate(offsetX - 10, canvas.height / 4); // FLEXIBLE (left of the Y-axis)
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("FLEXIBLE", 0, 0);
        ctx.restore();
  
        ctx.save();
        ctx.translate(offsetX - 10, (3 * canvas.height) / 4); // FIXED (left of the Y-axis)
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("FIXED", 0, 0);
        ctx.restore();
  
        // X-axis labels
        ctx.fillText("RELATIONAL", canvas.width / 4, offsetY + borderHeight + 14); // RELATIONAL (below X-axis)
        ctx.fillText(
          "INSTITUTIONAL",
          (3 * canvas.width) / 4,
          offsetY + borderHeight + 14
        ); // INSTITUTIONAL (below X-axis)
  
        // Draw quadrant labels (inside the border)
        ctx.textBaseline = "top"; // Position at the top
        // ctx.textAlign = "left";
        const rightAlign = canvas.width * .75
        ctx.fillText("Bridge Builder", rightAlign, offsetY + 20);
        // ctx.textAlign = "right";
        const leftAlign = canvas.width * .25
        ctx.fillText("Trail Guide", leftAlign, offsetY + 20);
        ctx.textBaseline = "bottom";
        // ctx.textAlign = "left";
        ctx.fillText(
          "Map Maker",
          rightAlign,
          offsetY + borderHeight - 20
        );
        // ctx.textAlign = "right";
        ctx.fillText(
          "Transport Helicopter",
          leftAlign,
          offsetY + borderHeight - 20
        );
  
        // Plot result
        ctx.fillStyle = "#40c7cc";
        ctx.beginPath();
        const x = offsetX + ((xSum / 12 + 1) * (borderWidth / 2));
        const y = offsetY + ((1 - ySum / 12) * (borderHeight / 2));
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [xSum, ySum]);
  

  return (
    <canvas
      ref={canvasRef}
      width={400} // Canvas size
      height={400}
      className="border-2 border-transparent rounded-lg"
    />
  );
};

export default Chart2x2;