import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Dynamically adjust scale for smaller screens
    const isMobile = window.innerWidth < 768; // Typical breakpoint for mobile
    const canvasScale = isMobile ? 1.5 : 2; // Reduce scale for mobile to fit better

    const canvas = await html2canvas(element, {
      scale: canvasScale,
      useCORS: true,
      logging: false,
    });

    const pageWidth = isMobile ? 148 : 210; // A5 for mobile, A4 otherwise
    const pageHeight = isMobile ? 210 : 297; // A5 for mobile, A4 otherwise
    const margin = isMobile ? 15 : 25.4; // Reduce margins for smaller screens

    // Calculate available content dimensions
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    // Scale chart to 80% of content width
    const scaledWidth = contentWidth * 0.8;
    const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

    // Center the chart horizontally
    const xOffset = margin + (contentWidth - scaledWidth) / 2;
    const yOffset = margin;

    const pdf = new jsPDF("p", "mm", isMobile ? "a5" : "a4"); // Use A5 for mobile, A4 otherwise

    // Add the chart image
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      scaledWidth + 20,
      scaledHeight + 20
    );

    // Load and add the TFA logo
    const logo = new window.Image();
    logo.src = "/TFA_logo.png"; // Ensure it's in `public/`

    logo.onload = function () {
      // Scale logo proportionally
      const logoWidth = logo.naturalWidth / 200;
      const logoHeight = logo.naturalHeight / 200;

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
