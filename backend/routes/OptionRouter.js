import express from 'express';
import OptionsController from '../controllers/OptionsController.js';
const router = express.Router();

router.get('/categories', OptionsController.getCategories);
router.get('/statuses', OptionsController.getStatuses);

export default router;