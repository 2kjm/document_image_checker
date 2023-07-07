import { parseDocx } from "./docx.js";
import { parsePdf } from "./pdf.js";

async function main() {
  await parseDocx();
  await parsePdf();
}

main().catch(console.error);
