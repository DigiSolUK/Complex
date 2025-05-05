import { Router, Request, Response } from 'express';
import { auth } from '../auth';
import { aiService } from '../services/ai-service';
import { z } from 'zod';

const router = Router();

// Schema for validating chat messages
const chatMessageSchema = z.object({
  patientId: z.number(),
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message is too long"),
});

// Endpoint for generating AI responses to patient messages
router.post('/chat', auth.isAuthenticated, async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { patientId, message } = chatMessageSchema.parse(req.body);
    
    // Generate response
    const response = await aiService.generatePatientSupportResponse(patientId, message);
    
    // Log the interaction
    await aiService.logChatInteraction(patientId, message, response);
    
    // Return the response
    res.json({ success: true, response });
  } catch (error) {
    console.error('Patient chatbot error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your message' 
    });
  }
});

// Endpoint for chat history (optional implementation)
router.get('/history/:patientId', auth.isAuthenticated, async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.patientId);
    
    // This is a placeholder. In a real implementation, you would fetch chat history
    // from your database using a dedicated method in storage
    const activities = await aiService.getChatHistory(patientId);
    
    res.json({ success: true, history: activities });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching chat history' 
    });
  }
});

export default router;
