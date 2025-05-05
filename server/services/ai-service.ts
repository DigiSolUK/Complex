import { Groq } from 'groq-sdk';
import { storage } from '../storage';

// Create a Groq client instance
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

class AIService {
  /**
   * Generate a compassionate response to a patient question
   * @param patientId The ID of the patient
   * @param message The patient's message
   * @param patientData Optional additional context about the patient
   * @returns A compassionate AI response
   */
  async generatePatientSupportResponse(patientId: number, message: string, patientData?: any): Promise<string> {
    try {
      // Get patient information if not provided
      if (!patientData) {
        patientData = await storage.getPatient(patientId);
      }
      
      // Prepare context for the AI
      const patientContext = patientData ? `
        Patient Name: ${patientData.name}
        Medical Conditions: ${patientData.medicalConditions || 'None specified'}
        Current Medications: ${patientData.medications || 'None specified'}
        Care Type: ${patientData.careType || 'Not specified'}
      ` : 'No patient information available.';

      // System prompt that guides the AI to be compassionate and healthcare-focused
      const systemPrompt = `You are a compassionate healthcare assistant for ComplexCare CRM. 
      Your purpose is to provide kind, empathetic support to patients while maintaining a professional tone. 
      You should sound warm and human, not clinical or robotic.
      
      IMPORTANT GUIDELINES:
      - Provide emotional support first, then practical information
      - Use simple, clear language without medical jargon when possible
      - Never diagnose conditions or prescribe treatments
      - Always recommend contacting healthcare providers for medical advice
      - Respect privacy and maintain confidentiality
      - If you don't know something, admit it and suggest talking to their care provider
      - Keep responses concise but warm (100-150 words maximum)
      
      PATIENT CONTEXT:
      ${patientContext}`;

      // Generate the AI response
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I wasn't able to generate a helpful response. Please contact your care provider for assistance.";
    } catch (error) {
      console.error('Error generating AI support response:', error);
      return "I apologize, but I'm having trouble responding right now. Please try again later or contact your care provider directly.";
    }
  }

  /**
   * Log a chat interaction for future reference and analytics
   * @param patientId The ID of the patient
   * @param message The patient's message
   * @param response The AI response
   * @param sentiment Optional sentiment analysis results
   */
  async logChatInteraction(patientId: number, message: string, response: string, sentiment?: any): Promise<void> {
    try {
      // Create an activity log for the chat interaction
      await storage.createActivityLog({
        userId: patientId, // Using patientId as userId since this is patient-initiated
        action: 'ai_chat',
        entityType: 'patient',
        entityId: patientId,
        details: `AI Chatbot interaction with patient ID ${patientId}`,
        metadata: JSON.stringify({
          patientMessage: message,
          aiResponse: response,
          sentiment: sentiment || null,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error logging chat interaction:', error);
    }
  }
  
  /**
   * Get chat history for a specific patient
   * @param patientId The ID of the patient
   * @returns Array of chat interactions
   */
  async getChatHistory(patientId: number): Promise<any[]> {
    try {
      // Get activities related to AI chat for this patient
      const activities = await storage.getRecentActivities(50); // Get last 50 activities
      
      // Filter for AI chat activities related to this patient
      const chatActivities = activities.filter(activity => 
        activity.entityType === 'patient' && 
        activity.entityId === patientId && 
        activity.action === 'ai_chat'
      );
      
      // Format the activities for display
      return chatActivities.map(activity => {
        try {
          const metadata = JSON.parse(activity.metadata || '{}');
          return {
            id: activity.id,
            timestamp: activity.createdAt,
            patientMessage: metadata.patientMessage || '',
            aiResponse: metadata.aiResponse || '',
            sentiment: metadata.sentiment || null
          };
        } catch (e) {
          console.error('Error parsing activity metadata:', e);
          return {
            id: activity.id,
            timestamp: activity.createdAt,
            patientMessage: '',
            aiResponse: '',
            error: 'Could not parse chat data'
          };
        }
      }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}

export const aiService = new AIService();
