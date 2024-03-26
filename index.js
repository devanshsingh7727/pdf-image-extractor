const { PDFDocument, PDFName } = require("pdf-lib");

function guessMimeType(imageBytes) {
  if (imageBytes[0] === 0xff && imageBytes[1] === 0xd8) {
    return "image/jpeg"; // JPEG
  } else if (
    imageBytes[0] === 0x89 &&
    imageBytes[1] === 0x50 &&
    imageBytes[2] === 0x4e &&
    imageBytes[3] === 0x47
  ) {
    return "image/png"; // PNG
  } else if (
    imageBytes[0] === 0x49 &&
    imageBytes[1] === 0x49 &&
    imageBytes[2] === 0x2a &&
    imageBytes[3] === 0x00
  ) {
    return "image/tiff"; // TIFF, little-endian order
  } else if (
    imageBytes[0] === 0x47 &&
    imageBytes[1] === 0x49 &&
    imageBytes[2] === 0x46
  ) {
    return "image/gif"; // GIF
  } else {
    // Default or add more conditions for other types
    return "application/octet-stream"; // Unknown or binary data
  }
}
const ExtractImages = async ({ pdf, fileType }) => {
  try {
    // Fetch the PDF

    let arrayBuffer;
    if (fileType === "url") {
      let response = await fetch(pdf);
      arrayBuffer = await response.arrayBuffer();
    } else if (fileType === "blob") {
      arrayBuffer = await pdf.arrayBuffer();
    } else {
      return;
    }

    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });
    const seenImages = new Set();
    // Placeholder for extracted images
    const extractedImages = [];
    // Iterate over each page
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);

      const resources = page.node.Resources();
      const xObjects = resources.get(PDFName.of("XObject"));
      if (xObjects) {
        for (const [key, ref] of xObjects.dict) {
          const pdfImage = pdfDoc.context.lookup(ref);

          const pngBytes = await pdfImage.asUint8Array();
          const mimeType = guessMimeType(pngBytes);
          const byteString = pngBytes.join(",");

          if (!seenImages.has(byteString)) {
            seenImages.add(byteString);
            let blob;
            if (mimeType === "image/png" || mimeType === "image/jpeg") {
              blob = new Blob([pngBytes], { type: mimeType });
            } else {
              continue;
            }
            const imageUrl = URL.createObjectURL(blob);
            extractedImages.push({
              blob: blob,
              url: imageUrl,
              type: "image",
              imageType: mimeType,
            });
          }
        }
      }
    }
    return extractedImages;
  } catch (error) {
    console.error("Error extracting images from PDF:", error);
  } finally {
  }
};

module.exports = {
  ExtractImages,
};
