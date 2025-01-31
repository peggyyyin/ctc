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

    const imgWidth = 105; // A4 width in mm
    const pageHeight = 148; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    // Add the main content to the PDF
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);

    // ✅ Load and add the TFA logo correctly
    const logo = new window.Image(); // Ensures TypeScript compatibility
    logo.src = "/TFA_logo.png"; // Make sure it's in `public/`

    logo.onload = function () {
      const marginRight = 10;
      const marginBottom = 10;
    
      // Use the image's natural size
      const logoWidth = logo.naturalWidth / 12; // Scale down if needed
      const logoHeight = logo.naturalHeight / 12; // Scale down if needed
    
      const x = imgWidth - logoWidth - marginRight;
      const y = pageHeight - logoHeight - marginBottom;

      pdf.addImage(logo, "PNG", x, y, logoWidth, logoHeight);
      pdf.save("crossing-the-canyon-result.pdf");
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// export const generatePDF = async (elementId: string) => {
//   const element = document.getElementById(elementId)
//   if (!element) return

//   try {
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//     })

//     const imgWidth = 210 // A4 width in mm
//     const pageHeight = 297 // A4 height in mm
//     const imgHeight = (canvas.height * imgWidth) / canvas.width
//     const pdf = new jsPDF("p", "mm", "a4")

//     pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight)
//     pdf.save("crossing-the-canyon-result.pdf")
//   } catch (error) {
//     console.error("Error generating PDF:", error)
//   }
// }