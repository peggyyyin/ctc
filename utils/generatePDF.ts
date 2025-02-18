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

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const logo = new Image();
      logo.src = "/TFA_logo.png"; // Ensure this file is in the public folder
      await new Promise((resolve) => {
        logo.onload = resolve;
      });
      const logoWidth = 200;
      const logoHeight = 100;
      const logoX = (canvas.width - logoWidth) / 2;
      const logoY = canvas.height - logoHeight - 20; // Position where card footer would be
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    }

    const dataUrl = canvas.toDataURL("image/png");

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
