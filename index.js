const { PDFDocument, PDFName, PDFRawStream } = require("pdf-lib");
const fs = require("fs");

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
    } else if (fileType === "filePath") {
      arrayBuffer = fs.readFileSync(pdf);
    } else {
      throw new Error("Invalid file type");
    }

    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });

    // Hold a set of seen images to avoid duplicates
    const seenImages = new Set();

    // Placeholder for extracted images
    const extractedImages = [];

    // Iterate over each page
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      const resources = page.node.Resources();
      const xObjects = resources.get(PDFName.of("XObject"));

      if (xObjects) {
        for (const [, ref] of xObjects.dict) {
          const pdfObject = pdfDoc.context.lookup(ref);

          if (pdfObject instanceof PDFRawStream) {
            const imageBytes = pdfObject.contents;
            const mimeType = guessMimeType(imageBytes);
            const byteString = imageBytes.join(",");

            if (seenImages.has(byteString)) {
              continue;
            }

            if (mimeType.startsWith("image/")) {
              const extension = mimeType.split("/")[1];
              const blob = new Blob([imageBytes], { type: mimeType });

              extractedImages.push({
                blob,
                url: URL.createObjectURL(blob),
                type: "image",
                imageType: mimeType,
                extension,
              });
            }
          }
        }
      }
    }

    return extractedImages;
  } catch (error) {
    console.error("Error extracting images from PDF:", error);
  }
};

module.exports = {
  ExtractImages,
};
