import { Router } from 'express';
import { auth } from '../../auth';
import { aiService } from '../../services/ai-service';

const router = Router();

/**
 * Get chat history for a patient
 * @route GET /api/patient-chatbot/history/:patientId
 * @access Private - Only accessible to authenticated users
 */
router.get('/history/:patientId', auth.isAuthenticated, async (req, res) => {
  try {
    const patientId = parseInt(req.params.patientId);
    
    if (isNaN(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    const chatHistory = await aiService.getChatHistory(patientId);
    return res.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Process a chat message from a patient
 * @route POST /api/patient-chatbot/chat
 * @access Private - Only accessible to authenticated users
 */
router.post('/chat', auth.isAuthenticated, async (req, res) => {
  try {
    const { patientId, message } = req.body;
    
    if (!patientId || !message) {
      return res.status(400).json({ success: false, message: 'Patient ID and message are required' });
    }

    // Process the message using the AI service
    const result = await aiService.processPatientMessage(patientId, message);
    
    return res.json(result);
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      response: "I'm sorry, I'm having trouble responding right now. Please try again later or contact your healthcare provider directly."
    });
  }
});

export default router;
