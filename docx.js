import { default as mammoth } from "mammoth";
import fs from "fs";
import path from "path";

// Check whether an image exists inside the docx file
async function checkImageExist(file) {
  try {
    const result = await mammoth.convertToHtml({ path: file });
    const text = result.value; // The raw text
    const imageExist = text.includes("img");
    return imageExist;
  } catch (error) {
    console.error(`Error processing DOCX ${file}: ${error}`);
    return false;
  }
}

export async function parseDocx() {
  const inputPath = "./input/docx";
  const outputPath = "./output";

  try {
    // Check if input directory exists
    if (!fs.existsSync(inputPath)) {
      console.log("Input directory does not exist");
      return;
    }

    const docxFiles = fs.readdirSync(inputPath);

    if (!docxFiles.length) {
      console.log("No docx files in input/docx");
      return;
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    let resultContentWithImages = "\nDocuments with Images:\n";
    let resultContentWithoutImages = "\nDocuments without Images:\n";

    for (let docx of docxFiles) {
      const docxPath = path.join(inputPath, docx);
      try {
        const imageExist = await checkImageExist(docxPath);
        console.log(`Images in ${docx}: ${imageExist}`);
        if (imageExist) {
          resultContentWithImages += `DOCX file: ${docx}\n`;
        } else {
          resultContentWithoutImages += `DOCX file: ${docx}\n`;
        }
      } catch (error) {
        console.error(`Error processing DOCX ${docx}: ${error}`);
        resultContentWithoutImages += `==> DOCX file: ${docx}, Error: ${error.message}\n`;
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
