import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
// @ts-expect-error: pdf-parse has compatibility issues with current TypeScript version
import pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import path from 'path';
import { getMongoDb } from '../../lib/mongodb';
import { supabase } from '../../lib/supabaseClient';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'tmp'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    // Create tmp directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const [, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = '';
    const filePath = file.filepath;
    const fileExtension = file.originalFilename?.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'pdf') {
        // Real PDF text extraction
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);
        extractedText = pdfData.text || 'Could not extract text from PDF';
      } else if (fileExtension === 'docx') {
        // Real DOCX text extraction
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value || 'Could not extract text from DOCX';
      } else if (fileExtension === 'txt') {
        // Plain text file
        extractedText = fs.readFileSync(filePath, 'utf8');
      } else {
        extractedText = 'Unsupported file format. Please upload .pdf, .docx, or .txt files.';
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      extractedText = 'Error reading file. Please paste your resume text manually.';
    }

    // Clean up the uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }

    // After extracting text, store in MongoDB
    try {
      // Get user from Supabase session (from Authorization header)
      const token = req.headers['authorization']?.replace('Bearer ', '');
      let userId = null;
      if (token) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
          userId = user.id;
        }
      }
      if (userId) {
        const db = await getMongoDb();
        const resumes = db.collection('resumes');
        await resumes.insertOne({
          userId,
          originalResume: extractedText,
          filename: file.originalFilename,
          uploadedAt: new Date(),
        });
      } else {
        console.warn('No user ID found, not storing CV in MongoDB');
      }
    } catch (mongoError) {
      console.error('Error saving original CV to MongoDB:', mongoError);
    }

    return res.status(200).json({
      success: true,
      text: extractedText,
      filename: file.originalFilename,
      size: file.size,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ error: 'Failed to process file' });
  }
}