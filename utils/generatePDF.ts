import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    // Add the main content to the PDF
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);

    // Add the TFA logo at the bottom-right
    const logo = new Image();
    logo.src = "/TFA_logo.png"; // Make sure the image is inside `public/` folder in Next.js
    logo.onload = function () {
      const logoWidth = 40; // Adjust as needed
      const logoHeight = 20; // Adjust as needed
      const marginRight = 10;
      const marginBottom = 10;

      const x = imgWidth - logoWidth - marginRight; // Position logo in the bottom-right
      const y = pageHeight - logoHeight - marginBottom;

      pdf.addImage(logo, "PNG", x, y, logoWidth, logoHeight);
      pdf.save("crossing-the-canyon-result.pdf");
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
