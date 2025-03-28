import { Router } from 'express';
import { sendReminders } from '../controllers/workflow.controller.js';

const workflowRouter = Router();

workflowRouter.get('/subscription/remainder', sendReminders);

export default workflowRouter;