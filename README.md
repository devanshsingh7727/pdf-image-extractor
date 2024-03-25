# pdfimagetextextractor

pdfimagetextextractor is a toolkit designed to help you extract images and text from PDF files easily. Whether you're dealing with URLs, blobs, or local binary data, this package can handle multiple file types. The module provides a streamlined interface for extracting images in common formats like PNG and JPEG as well as extracting all text content from your PDF files.

## Features

- Extract images from PDF documents.
- Identify MIME type of extracted images for proper handling.
- Convert PDF images to their respective Blob URLs for easy display or download.
- Extract plain text content from PDF documents for text analysis or processing.
- Support for multiple source types including URLs and blobs.

## Installation

Install the package by running:
```npm install pdfimagetextextractor```

## Usage

Below are quick usage guides for both text and image extraction from a PDF file.

### Extracting Text from PDF

```javascript

const { ExtractText } = require('pdfimagetextextractor');

const pdfSource = 'path/to/your/document.pdf'; // This can be a URL or a Blob
const fileType = 'url'; // or 'blob' based on your input type

ExtractText({ pdf: pdfSource, fileType: fileType }).then((text) => {
console.log(text);
});
```
### Extracting Images from PDF


```javascript
const { ExtractImages } = require('pdfimagetextextractor');

const pdfSource = 'path/to/your/document.pdf'; // This can be a URL or a Blob
const fileType = 'url'; // or 'blob' based on your input type

ExtractImages({ pdf: pdfSource, fileType: fileType }).then((images) => {
images.forEach((image) => {
console.log(image.url); // Blob URL for the image
// You can use the blob URL to display the image or download it
})
});
```
## API

### `ExtractText({ pdf, fileType })`

Extracts text content from a PDF document.

Parameters:

- `pdf`: A String URL or Blob of the PDF file.
- `fileType`: A string indicating the type of `pdf`. Use `'url'` for URL inputs and `'blob'` for Blob inputs.

Returns:

- A Promise that resolves with a string containing all extracted text from the PDF file.

### `ExtractImages({ pdf, fileType })`

Extracts images from a PDF document and provides Blob URLs for use.

Parameters:

- `pdf`: A String URL or Blob of the PDF file.
- `fileType`: A string indicating the type of `pdf`. Use `'url'` for URL inputs and `'blob'` for Blob inputs.

Returns:

- A Promise that resolves with an array of objects. Each object contains properties: `blob`, `url`, `type`, and `imageType` corresponding to the extracted image.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

Distributed under the MIT License. See `LICENSE` for more information.



This README is a starting point, and you can certainly expand upon it to include other sections such as a "Known Issues" or "Changelog" as your package evolves.
