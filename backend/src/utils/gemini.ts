import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const MAX_INPUT_LENGTH = 10_000;

/** Strip control characters and cap length to prevent prompt injection and abuse. */
const sanitizeInput = (text: string): string => {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .slice(0, MAX_INPUT_LENGTH);
};

export interface ParsedJobData {
  isValidJobDescription: boolean;
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  salaryRange: string;
}

/**
 * Parses a raw job description string into structured JSON.
 */
export const parseJobDescription = async (jd: string): Promise<ParsedJobData> => {
  const prompt = `
    You are an expert recruitment AI. Analyze the following job description and extract the key details in a structured JSON format.
    
    Job Description:
    """
    ${sanitizeInput(jd)}
    """
    
    Return ONLY a JSON object with the following keys:
    - isValidJobDescription (boolean: true if this looks like a job description, false if it is gibberish or unrelated)
    - company (string)
    - role (string)
    - requiredSkills (array of strings)
    - niceToHaveSkills (array of strings)
    - seniority (string, e.g., Junior, Mid, Senior, Lead)
    - location (string, e.g., Remote, San Francisco, CA)
    - salaryRange (string, e.g., ₹100k - ₹120k)
    
    If any field is not found, use an empty string or empty array.
    Ensure the output is valid JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response text (handling potential markdown formatting)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ParsedJobData;
    }
    throw new Error('Failed to parse AI response as JSON');
  } catch (error) {
    console.error('Gemini Parsing Error:', error);
    throw error;
  }
};

/**
 * Generates tailored resume bullet points based on the JD and optionally the user's current resume.
 */
export const generateResumeSuggestions = async (
  jd: string, 
  role: string, 
  resumeText?: string
): Promise<string[]> => {
  const prompt = `
    You are a professional resume writer. Your goal is to generate 4-5 high-impact, results-oriented resume bullet points for a "${role}" position based on the provided Job Description.
    
    Job Description:
    """
    ${sanitizeInput(jd)}
    """
    
    ${resumeText ? `
    User's Current Resume Experience:
    """
    ${resumeText}
    """
    
    IMPORTANT: Use the user's actual experience from their resume to tailor these points. Match their past achievements and skills to the JD requirements. If the user doesn't have a direct match for a skill, generate a point that highlights a transferable skill they DO have.
    ` : 'Generate points based on the JD requirements and typical industry standards.'}
    
    Each bullet point should:
    - Start with a strong action verb.
    - Highlight specific skills and keywords mentioned in the JD.
    - Focus on impact and measurable results (even if you have to infer typical metrics).
    - Be concise and professional.
    
    Return ONLY a JSON array of strings. No numbering, no introductory text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as string[];
    }
    throw new Error('Failed to parse AI response as JSON array');
  } catch (error) {
    console.error('Gemini Suggestions Error:', error);
    throw error;
  }
};
/**
 * Streams tailored resume bullet points based on the JD and optionally the user's current resume.
 */
export const generateResumeSuggestionsStream = async function* (
  jd: string,
  role: string,
  resumeText?: string
) {
  const prompt = `
    You are a professional resume writer. Generate 3-5 high-impact, results-oriented resume bullet points for a "${role}" position based on the provided Job Description.
    
    Job Description:
    """
    ${sanitizeInput(jd)}
    """
    
    ${resumeText ? `
    User's Current Resume Experience:
    """
    ${resumeText}
    """
    
    IMPORTANT: Use the user's actual experience from their resume to tailor these points. Match their past achievements to the JD requirements.
    ` : 'Generate points based on the JD requirements and typical industry standards.'}
    
    Format: Return each bullet point on a NEW LINE starting with "• ". 
    No introductory text, no JSON, no formatting besides the bullet points.
    Generate exactly 3 concise, high-impact points.
  `;

  try {
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error) {
    console.error('Gemini Streaming Error:', error);
    throw error;
  }
};

