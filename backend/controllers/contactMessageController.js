import contactMessageModel from '../models/contactMessageModel.js';
import { sendContactResponseEmail } from '../utils/emailService.js';

// Submit contact message (public endpoint)
const submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.json({
                success: false,
                message: "Name, email, and message are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Get client IP and user agent for tracking
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Create new contact message
        const newMessage = new contactMessageModel({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject?.trim() || 'General Inquiry',
            message: message.trim(),
            ipAddress,
            userAgent
        });

        const savedMessage = await newMessage.save();

        console.log('✅ Contact message saved:', savedMessage._id);

        res.json({
            success: true,
            message: "Thank you for your message! We'll get back to you soon.",
            messageId: savedMessage._id
        });

    } catch (error) {
        console.error('❌ Error submitting contact message:', error);
        res.json({
            success: false,
            message: "Failed to send message. Please try again."
        });
    }
};

// Get all contact messages (admin only)
const getAllContactMessages = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 10, search } = req.query;
        
        // Build filter object
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (priority && priority !== 'all') {
            filter.priority = priority;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Get messages with pagination
        const messages = await contactMessageModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalMessages = await contactMessageModel.countDocuments(filter);
        
        // Get statistics
        const stats = await contactMessageModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusStats = {
            new: 0,
            read: 0,
            replied: 0,
            resolved: 0,
            archived: 0
        };

        stats.forEach(stat => {
            statusStats[stat._id] = stat.count;
        });

        res.json({
            success: true,
            messages,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages,
                hasNext: page * limit < totalMessages,
                hasPrev: page > 1
            },
            stats: statusStats
        });

    } catch (error) {
        console.error('❌ Error fetching contact messages:', error);
        res.json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};

// Get single contact message (admin only)
const getContactMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await contactMessageModel.findById(messageId);
        
        if (!message) {
            return res.json({
                success: false,
                message: "Message not found"
            });
        }

        // Mark as read if it was new
        if (message.status === 'new') {
            message.status = 'read';
            await message.save();
        }

        res.json({
            success: true,
            message
        });

    } catch (error) {
        console.error('❌ Error fetching contact message:', error);
        res.json({
            success: false,
            message: "Failed to fetch message"
        });
    }
};

// Update contact message status (admin only)
const updateMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { status, priority, adminNotes } = req.body;

        const validStatuses = ['new', 'read', 'replied', 'resolved', 'archived'];
        const validPriorities = ['low', 'medium', 'high', 'urgent'];

        if (status && !validStatuses.includes(status)) {
            return res.json({
                success: false,
                message: "Invalid status"
            });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.json({
                success: false,
                message: "Invalid priority"
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const updatedMessage = await contactMessageModel.findByIdAndUpdate(
            messageId,
            updateData,
            { new: true }
        );

        if (!updatedMessage) {
            return res.json({
                success: false,
                message: "Message not found"
            });
        }

        res.json({
            success: true,
            message: "Message updated successfully",
            updatedMessage
        });

    } catch (error) {
        console.error('❌ Error updating contact message:', error);
        res.json({
            success: false,
            message: "Failed to update message"
        });
    }
};

// Send reply to contact message (admin only)
const replyToMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { replyMessage, adminName } = req.body;

        if (!replyMessage) {
            return res.json({
                success: false,
                message: "Reply message is required"
            });
        }

        const contactMessage = await contactMessageModel.findById(messageId);
        
        if (!contactMessage) {
            return res.json({
                success: false,
                message: "Message not found"
            });
        }

        // Send reply email
        const emailResult = await sendContactResponseEmail(
            contactMessage.email,
            contactMessage.name,
            contactMessage.subject,
            contactMessage.message,
            replyMessage,
            adminName || 'Vortex Clothing Team'
        );

        if (emailResult.success) {
            // Update message status
            contactMessage.status = 'replied';
            contactMessage.respondedBy = adminName || 'Admin';
            contactMessage.responseDate = new Date();
            await contactMessage.save();

            res.json({
                success: true,
                message: "Reply sent successfully"
            });
        } else {
            res.json({
                success: false,
                message: "Failed to send reply email"
            });
        }

    } catch (error) {
        console.error('❌ Error sending reply:', error);
        res.json({
            success: false,
            message: "Failed to send reply"
        });
    }
};

// Delete contact message (admin only)
const deleteContactMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await contactMessageModel.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.json({
                success: false,
                message: "Message not found"
            });
        }

        res.json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error('❌ Error deleting contact message:', error);
        res.json({
            success: false,
            message: "Failed to delete message"
        });
    }
};

// Bulk update messages (admin only)
const bulkUpdateMessages = async (req, res) => {
    try {
        const { messageIds, action, status, priority } = req.body;

        if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
            return res.json({
                success: false,
                message: "Message IDs are required"
            });
        }

        let updateData = {};

        switch (action) {
            case 'mark_read':
                updateData.status = 'read';
                break;
            case 'mark_resolved':
                updateData.status = 'resolved';
                break;
            case 'archive':
                updateData.status = 'archived';
                break;
            case 'update_priority':
                if (priority) updateData.priority = priority;
                break;
            case 'update_status':
                if (status) updateData.status = status;
                break;
            default:
                return res.json({
                    success: false,
                    message: "Invalid action"
                });
        }

        const result = await contactMessageModel.updateMany(
            { _id: { $in: messageIds } },
            updateData
        );

        res.json({
            success: true,
            message: `Updated ${result.modifiedCount} messages successfully`
        });

    } catch (error) {
        console.error('❌ Error bulk updating messages:', error);
        res.json({
            success: false,
            message: "Failed to update messages"
        });
    }
};

export {
    submitContactMessage,
    getAllContactMessages,
    getContactMessage,
    updateMessageStatus,
    replyToMessage,
    deleteContactMessage,
    bulkUpdateMessages
};