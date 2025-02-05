"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Dynamically adjust scale for smaller screens
    const isMobile = window.innerWidth < 768;
    const canvasScale = isMobile ? 1.5 : 2;

    const canvas = await html2canvas(element, {
      scale: canvasScale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // Ensure white background
    });

    const pageWidth = isMobile ? 148 : 210; // A5 for mobile, A4 for desktop
    const pageHeight = isMobile ? 210 : 297;
    const margin = isMobile ? 10 : 25;

    // Calculate content area
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    // Scale content to fit inside PDF
    const scaledWidth = contentWidth;
    const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

    // Centering calculations
    const xOffset = margin;
    let yOffset = margin;

    const pdf = new jsPDF("p", "mm", isMobile ? "a5" : "a4");

    // **Add Screenshot of Card (excluding buttons)**
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      scaledWidth,
      scaledHeight
    );

    yOffset += scaledHeight + 10; // Adjust space for the TFA logo

    // **Load and Add TFA Logo where the Download Result button was**
    const logo = new window.Image();
    logo.src = "/TFA_logo.png"; // Ensure it's in `public/`

    logo.onload = function () {
      const logoWidth = 40; // Adjust based on actual logo size
      const logoHeight = 40;

      const logoX = pageWidth / 2 - logoWidth / 2; // Center logo
      const logoY = yOffset; // Place below the content

      pdf.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

      pdf.save("crossing-the-canyon-result.pdf");
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
