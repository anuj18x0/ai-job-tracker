import express from 'express';
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  parseJD,
  generateSuggestions,
  generateSuggestionsStream,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All job routes are protected

router.route('/')
  .get(getJobs)
  .post(createJob);

router.route('/:id')
  .put(updateJob)
  .delete(deleteJob);

router.post('/parse', parseJD);
router.post('/:id/suggest', generateSuggestions);
router.get('/:id/suggest-stream', generateSuggestionsStream);


export default router;
