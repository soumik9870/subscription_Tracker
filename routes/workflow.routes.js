import { Router } from 'express';
import { sendRemainders } from '../controllers/workflow.controller.js';

const workflowRouter = Router();

workflowRouter.get('/subscription/remainder', sendRemainders);

export default workflowRouter;