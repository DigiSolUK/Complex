import { Router } from 'express';
import { aiService } from '../../services/ai-service';
import { auth } from '../../auth';

const router = Router();

// Get chat history for a patient
router.get('/history/:patientId', auth.isAuthenticated, async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    
    if (isNaN(patientId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid patient ID' 
      });
    }
    
    const result = await aiService.getChatHistory(patientId);
    return res.json(result);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch chat history' 
    });
  }
});

// Process a chat message
router.post('/chat', auth.isAuthenticated, async (req, res) => {
  try {
    const { patientId, message } = req.body;
    
    if (!patientId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Patient ID and message are required' 
      });
    }
    
    const result = await aiService.processPatientMessage(patientId, message);
    return res.json(result);
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process message', 
      response: "I'm sorry, I'm having trouble responding right now. Please try again later."
    });
  }
});

export default router;
