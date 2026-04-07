import type { Request, Response, NextFunction } from 'express';
import Job, { type IJob, type ApplicationStatus } from '../models/Job.js';
import { parseJobDescription, generateResumeSuggestions, generateResumeSuggestionsStream } from '../utils/gemini.js';

/**
 * @desc    Get all jobs for current user
 * @route   GET /api/jobs
 * @access  Private
 */
export const getJobs = async (req: any, res: Response, next: NextFunction) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create new job
 * @route   POST /api/jobs
 * @access  Private
 */
export const createJob = async (req: any, res: Response, next: NextFunction) => {
  try {
    req.body.userId = req.user.id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update job
 * @route   PUT /api/jobs/:id
 * @access  Private
 */
export const updateJob = async (req: any, res: Response, next: NextFunction) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user owns the job
    if (String(job.userId) !== String(req.user.id)) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Delete job
 * @route   DELETE /api/jobs/:id
 * @access  Private
 */
export const deleteJob = async (req: any, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user owns the job
    if (String(job.userId) !== String(req.user.id)) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Parse JD with AI
 * @route   POST /api/jobs/parse
 * @access  Private
 */
export const parseJD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jd } = req.body;
    if (!jd) {
      return res.status(400).json({ success: false, message: 'Please provide a job description' });
    }

    const data = await parseJobDescription(jd);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Generate resume suggestions
 * @route   POST /api/jobs/:id/suggest
 * @access  Private
 */
export const generateSuggestions = async (req: any, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.rawJobDescription) {
      return res.status(400).json({ success: false, message: 'No job description found for this application' });
    }

    const suggestionsTexts = await generateResumeSuggestions(
      job.rawJobDescription, 
      job.role,
      req.user.resumeText
    );
    
    // Map to the required format
    const resumeSuggestions = suggestionsTexts.map((text, idx) => ({
      id: `suggestion-${Date.now()}-${idx}`,
      text
    }));

    job.resumeSuggestions = resumeSuggestions;
    await job.save();

    res.status(200).json({ success: true, suggestions: resumeSuggestions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * @desc    Generate resume suggestions (Streaming)
 * @route   GET /api/jobs/:id/suggest-stream
 * @access  Private
 */
export const generateSuggestionsStream = async (req: any, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.rawJobDescription) {
      return res.status(400).json({ success: false, message: 'No job description found for this application' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Prevent Nginx buffering

    const stream = generateResumeSuggestionsStream(
      job.rawJobDescription,
      job.role,
      req.user.resumeText
    );

    let fullText = '';
    for await (const chunk of stream) {
      fullText += chunk;
      // Send data to client
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      
      // Explicitly flush the response if using compression or certain middleware
      if ((res as any).flush) {
        (res as any).flush();
      }
    }

    // Optionally save the full generated text back to the job model 
    // after cleaning up bullet points
    const lines = fullText.split('\n').filter(l => l.trim().startsWith('•'));
    const resumeSuggestions = lines.map((line, idx) => ({
      id: `suggestion-${Date.now()}-${idx}`,
      text: line.replace('•', '').trim()
    }));

    if (resumeSuggestions.length > 0) {
      job.resumeSuggestions = resumeSuggestions;
      await job.save();
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    console.error('Controller Streaming Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
};
