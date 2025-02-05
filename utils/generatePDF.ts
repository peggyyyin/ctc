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

    const pageWidth = 140; // A4 width in mm
    const pageHeight = 198; // A4 height in mm
    const margin = 25.4; // 1 inch margin in mm

    // Calculate content dimensions considering 1-inch margins
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    // Adjust image dimensions based on content size
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    // Add the main content with margins
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      margin,
      margin,
      contentWidth,
      imgHeight
    );

    // ✅ Load and add the TFA logo correctly
    const logo = new window.Image(); // Ensures TypeScript compatibility
    logo.src = "/TFA_logo.png"; // Ensure it's in `public/`

    logo.onload = function () {
      // Use the image's natural size
      const logoWidth = logo.naturalWidth / 200; // Adjust scaling as needed
      const logoHeight = logo.naturalHeight / 200; // Adjust scaling as needed

      // Position logo with respect to the margin
      const x = pageWidth - logoWidth - margin;
      const y = pageHeight - logoHeight - margin;

      pdf.addImage(logo, "PNG", x, y, logoWidth, logoHeight);
      pdf.save("crossing-the-canyon-result.pdf");
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
