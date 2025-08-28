import express from 'express';
import {
    submitContactMessage,
    getAllContactMessages,
    getContactMessage,
    updateMessageStatus,
    replyToMessage,
    deleteContactMessage,
    bulkUpdateMessages
} from '../controllers/contactMessageController.js';

const contactRouter = express.Router();

// Public route - submit contact message
contactRouter.post('/submit', submitContactMessage);

// Admin routes (these would need admin authentication middleware in production)
contactRouter.get('/admin/all', getAllContactMessages);
contactRouter.get('/admin/:messageId', getContactMessage);
contactRouter.put('/admin/:messageId/status', updateMessageStatus);
contactRouter.post('/admin/:messageId/reply', replyToMessage);
contactRouter.delete('/admin/:messageId', deleteContactMessage);
contactRouter.put('/admin/bulk-update', bulkUpdateMessages);

export default contactRouter;