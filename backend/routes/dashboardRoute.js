import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

// Get comprehensive dashboard statistics
dashboardRouter.get('/stats', getDashboardStats);

export default dashboardRouter;

