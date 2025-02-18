// "use client";

// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";
// import { useEffect } from "react";

// export const generatePDF = async (elementId: string, resultData: any) => {
//   const element = document.getElementById(elementId);
//   if (!element) return;

//   try {
//     const isMobile = window.innerWidth < 768;
//     const canvasScale = isMobile ? 1.5 : 2;

//     const canvas = await html2canvas(element, {
//       scale: canvasScale,
//       useCORS: true,
//       logging: false,
//       backgroundColor: "#ffffff",
//     });

//     const pageWidth = isMobile ? 148 : 210; 
//     const pageHeight = isMobile ? 275 : 350;
//     const margin = isMobile ? 15 : 25;
    
//     const contentWidth = pageWidth - 2 * margin;
//     const contentHeight = pageHeight - 2 * margin;
//     const scaledWidth = contentWidth;
//     const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

//     const xOffset = margin;
//     let yOffset = margin;

//     const pdf = new jsPDF("p", "mm", isMobile ? "a5" : "a4");

//     // Add screenshot of the content area (with the chart)
//     pdf.addImage(
//       canvas.toDataURL("image/png"),
//       "PNG",
//       xOffset,
//       yOffset,
//       scaledWidth,
//       scaledHeight
//     );

//     yOffset += scaledHeight; // Add gap after content

//     // // Add title and description dynamically
//     // pdf.setFont("helvetica", "normal");
//     // pdf.setFontSize(16);
//     // pdf.text(resultData.title, pageWidth / 2 - pdf.getTextWidth(resultData.title) / 2, yOffset);
    
//     // yOffset += 10; // Add space after the title
//     // pdf.setFontSize(12);
//     // pdf.text(resultData.description, pageWidth / 2 - pdf.getTextWidth(resultData.description) / 2, yOffset);

//     // Adjust yOffset after the description
//     yOffset += 10; // Add space after description

//     // Check if the content height exceeds the page height and create a new page if necessary
//     if (yOffset + 30 > pageHeight) {
//       pdf.addPage();
//       yOffset = margin; // Reset yOffset after new page
//     }

//     // Add logo to the PDF
//     const logo = new window.Image();
//     logo.src = "/TFA_logo.png"; // Ensure it's in `public/`

//     logo.onload = function () {
//       const logoWidth = 20;
//       const logoHeight = 14;
//       const logoX = pageWidth / 2 - logoWidth / 2;
//       const logoY = yOffset;
      
//       pdf.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
//       pdf.save("crossing-the-canyon-result.pdf");
//     };
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// };
"use client";

import html2canvas from "html2canvas";

export const generatePNG = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found!");
    return;
  }

  try {
    // Set fixed width and height for consistent output
    const width = 2138;
    const height = 1538;

    const canvas = await html2canvas(element, {
      scale: 1, // Keep scale at 1 to match defined dimensions
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: width, 
      height: height, 
    });

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
