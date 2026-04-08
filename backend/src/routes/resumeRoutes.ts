import express, { type Response } from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { extractTextFromFile } from '../utils/extractText.js';
import { uploadResumeToS3 } from '../utils/s3.js';
import type { AuthRequest } from '../types.js';

const router = express.Router();

// Multer storage setup (in-memory before uploading to S3)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
    }
  },
});

/**
 * @desc    Upload resume, extract text, store file in S3
 * @route   POST /api/resume/upload
 * @access  Private
 */
router.post('/upload', protect, upload.single('resume'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const extractedText = await extractTextFromFile(req.file.buffer, req.file.mimetype);

    // Upload original file to S3
    const s3Key = await uploadResumeToS3(
      String(req.user._id),
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    // Save text + S3 key reference to user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.resumeText = extractedText;
    user.resumeS3Key = s3Key;
    user.resumeLastUpdated = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      lastUpdated: user.resumeLastUpdated,
    });
  } catch (err: unknown) {
    console.error('Resume Upload Error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @desc    Get resume status
 * @route   GET /api/resume/status
 * @access  Private
 */
router.get('/status', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      hasResume: !!user.resumeText,
      lastUpdated: user.resumeLastUpdated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
