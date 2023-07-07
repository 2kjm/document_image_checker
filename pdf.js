import { exportImages } from "pdf-export-images";
import fs from "fs";
import path from "path";

export async function parsePdf() {
  const inputPath = "./input/pdf";
  const outputPath = "./output";
  const tempPath = "./temp";

  try {
    // Check if input directory exists
    if (!fs.existsSync(inputPath)) {
      console.log("Input directory does not exist");
      return;
    }

    const pdfs = fs.readdirSync(inputPath);

    if (!pdfs.length) {
      console.log("No pdfs in input/pdfs");
      return;
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    // Ensure temp directory exists
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath);
    }

    let resultContentWithImages = "\nPDFs with Images:\n";
    let resultContentWithoutImages = "\nPDFs without Images:\n";

    for (let pdf of pdfs) {
      const pdfPath = path.join(inputPath, pdf);
      try {
        const images = await exportImages(pdfPath, tempPath);
        console.log("Exported", images.length, "images");
        if (images.length > 0) {
          resultContentWithImages += `${pdf}, No. of exported images: ${images.length}\n`;
        } else {
          resultContentWithoutImages += `${pdf}, No. of exported images: ${images.length}\n`;
        }
      } catch (error) {
        console.error(`Error processing PDF ${pdf}: ${error}`);
        resultContentWithoutImages += `==> ERROR: ${pdf}, Error: ${error.message}\n`;
      }
    }

    // Write result to the file
    const finalResultContent = `${resultContentWithImages}\n${resultContentWithoutImages}`;
    fs.writeFileSync(path.join(outputPath, "result.txt"), finalResultContent, {
      flag: "a",
    });
  } catch (error) {
    console.error(`Unexpected error occurred: ${error}`);
  }
}
