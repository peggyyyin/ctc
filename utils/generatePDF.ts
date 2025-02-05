import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 25.4; // 1 inch margin in mm

    // Calculate available content dimensions (excluding margins)
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    // ✅ Scale chart to 80% of content width
    const scaledWidth = contentWidth * 0.8;
    const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

    // ✅ Center the image horizontally
    const xOffset = margin + (contentWidth - scaledWidth) / 2;
    const yOffset = margin;

    const pdf = new jsPDF("p", "mm", "a4");

    // Add the main content with adjusted scaling
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      scaledWidth,
      scaledHeight
    );

    // ✅ Load and add the TFA logo correctly
    const logo = new window.Image();
    logo.src = "/TFA_logo.png"; // Ensure it's in `public/`

    logo.onload = function () {
      // Scale logo proportionally
      const logoWidth = logo.naturalWidth / 200; // Adjust scaling as needed
      const logoHeight = logo.naturalHeight / 200; // Adjust scaling as needed

      // Position logo in the bottom right, respecting margins
      const x = pageWidth - logoWidth - margin;
      const y = pageHeight - logoHeight - margin;

      pdf.addImage(logo, "PNG", x, y, logoWidth, logoHeight);
      pdf.save("crossing-the-canyon-result.pdf");
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
