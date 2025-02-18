"use client";

import html2canvas from "html2canvas";

export const generatePDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found!");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Increase scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const logo = new Image();
    logo.src = "/TFA_logo.png"; // Ensure this file is in the public folder
    await new Promise((resolve) => {
      logo.onload = resolve;
    });

    const logoWidth = 200;
    const logoHeight = 100;
    const padding = 40;
    const logoPadding = 20; // Extra space between canvas and logo
    const finalWidth = canvas.width;
    const finalHeight = canvas.height + logoHeight + padding * 2 + logoPadding + 80;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalWidth;
    finalCanvas.height = finalHeight + 40;
    const ctx = finalCanvas.getContext("2d");

    if (ctx) {
      // Fill background color
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      // Draw original content
      ctx.drawImage(canvas, 0, padding);

      // Draw logo at the bottom center
      const logoX = (finalWidth - logoWidth) / 2;
      const logoY = finalHeight - logoHeight - 40;
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    }

    const dataUrl = finalCanvas.toDataURL("image/png");

    // Trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "crossing-the-canyon-result.png";
    document.body.appendChild(link); // Append to body to ensure click works
    link.click();
    document.body.removeChild(link); // Clean up
  } catch (error) {
    console.error("Error generating PNG:", error);
  }
};
