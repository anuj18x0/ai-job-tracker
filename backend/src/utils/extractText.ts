import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts text from a PDF or DOCX buffer.
 * @param buffer The file buffer
 * @param mimetype The file mimetype
 */
export const extractTextFromFile = async (buffer: Buffer, mimetype: string): Promise<string> => {
  if (mimetype === 'application/pdf') {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }
  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
};
