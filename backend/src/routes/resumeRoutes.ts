import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { extractTextFromFile } from '../utils/extractText.js';

const router = express.Router();

// Multer storage setup (in-memory)
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
 * @desc    Upload resume and extract text
 * @route   POST /api/resume/upload
 * @access  Private
 */
router.post('/upload', protect, upload.single('resume'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const extractedText = await extractTextFromFile(req.file.buffer, req.file.mimetype);

    // Update user's resume text
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.resumeText = extractedText;
    user.resumeLastUpdated = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      lastUpdated: user.resumeLastUpdated,
    });
  } catch (err: any) {
    console.error('Resume Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @desc    Get resume status
 * @route   GET /api/resume/status
 * @access  Private
 */
router.get('/status', protect, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      hasResume: !!user.resumeText,
      lastUpdated: user.resumeLastUpdated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
