// "use client";

// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";

// export const generatePDF = async (elementId: string) => {
//   const element = document.getElementById(elementId);
//   if (!element) return;

//   try {
//     // Dynamically adjust scale for smaller screens
//     const isMobile = window.innerWidth < 768;
//     const canvasScale = isMobile ? 1.5 : 2;

//     const canvas = await html2canvas(element, {
//       scale: canvasScale,
//       useCORS: true,
//       logging: false,
//       backgroundColor: "#ffffff", // Ensure white background
//     });

//     const pageWidth = isMobile ? 148 : 210; // A5 for mobile, A4 for desktop
//     const pageHeight = isMobile ? 210 : 297;
//     const margin = isMobile ? 15 : 25;

//     // Calculate content area
//     const contentWidth = pageWidth - 2 * margin;
//     const contentHeight = pageHeight - 2 * margin;

//     // Scale content to fit inside PDF
//     const scaledWidth = contentWidth;
//     const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

//     // Centering calculations
//     const xOffset = margin;
//     let yOffset = margin;

//     const pdf = new jsPDF("p", "mm", isMobile ? "a5" : "a4");

//     // **Add Screenshot of Card (excluding buttons)**
//     pdf.addImage(
//       canvas.toDataURL("image/png"),
//       "PNG",
//       xOffset,
//       yOffset,
//       scaledWidth,
//       scaledHeight
//     );

//     // Adjust the yOffset after the content to make room for the logo
//     yOffset += scaledHeight; // Add a small gap below the content

//     // **Load and Add TFA Logo where the Download Result button was**
//     const logo = new window.Image();
//     logo.src = "/TFA_logo.png"; // Ensure it's in `public/`

//     logo.onload = function () {
//       const logoWidth = 20; // Adjust based on actual logo size
//       const logoHeight = 14;

//       const logoX = pageWidth / 2 - logoWidth / 2; // Center logo horizontally
//       const logoY = yOffset; // Place logo below the content

//       pdf.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

//       pdf.save("crossing-the-canyon-result.pdf");
//     };
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// };

"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useEffect } from "react";

export const generatePDF = async (elementId: string, resultData: any) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const isMobile = window.innerWidth < 768;
    const canvasScale = isMobile ? 1.5 : 2;

    const canvas = await html2canvas(element, {
      scale: canvasScale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const pageWidth = isMobile ? 148 : 210; 
    const pageHeight = isMobile ? 210 : 297;
    const margin = isMobile ? 15 : 25;
    
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;
    const scaledWidth = contentWidth;
    const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

    const xOffset = margin;
    let yOffset = margin;

    const pdf = new jsPDF("p", "mm", isMobile ? "a5" : "a4");

    // Add screenshot of the content area (with the chart)
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      scaledWidth,
      scaledHeight
    );

    yOffset += scaledHeight; // Add gap after content

    // // Add title and description
    // pdf.setFont("helvetica", "normal");
    // pdf.setFontSize(16);
    // pdf.text(resultData.title, pageWidth / 2 - pdf.getTextWidth(resultData.title) / 2, yOffset);
    
    // yOffset += 10; // Add space after the title
    // pdf.setFontSize(12);
    // pdf.text(resultData.description, pageWidth / 2 - pdf.getTextWidth(resultData.description) / 2, yOffset);

    // Adjust yOffset after the description
    yOffset += 5; // Add space after description
    
    // Add logo to the PDF
    const logo = new window.Image();
    logo.src = "/TFA_logo.png"; // Make sure the logo path is correct in the public folder

    logo.onload = function () {
      const logoWidth = 20;
      const logoHeight = 14;
      const logoX = pageWidth / 2 - logoWidth / 2;
      const logoY = yOffset;
      
      pdf.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
      pdf.save("crossing-the-canyon-result.pdf");
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
