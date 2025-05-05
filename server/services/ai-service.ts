import { Groq } from 'groq-sdk';
import { db } from '../db';
import { chatHistory, patients } from '@shared/schema';
import { eq, desc, asc } from 'drizzle-orm';

class AIService {
  private groqClient: Groq;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not found in environment variables. AI features will not work properly.');
    }
    
    this.groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Get the patient's medical context from the database
   */
  private async getPatientContext(patientId: number): Promise<string> {
    try {
      // Fetch basic patient data from database
      const patientData = await db.select()
        .from(patients)
        .where(eq(patients.id, patientId))
        .limit(1);

      if (!patientData || patientData.length === 0) {
        return "No patient data available";
      }

      const patient = patientData[0];

      // Build a context string with relevant patient information
      let context = `Patient Information:\n`;
      context += `Name: ${patient.name}\n`;
      context += `Patient ID: ${patient.patientId}\n`;
      
      if (patient.dateOfBirth) {
        context += `Date of Birth: ${patient.dateOfBirth}\n`;
      }
      
      if (patient.gender) {
        context += `Gender: ${patient.gender}\n`;
      }
      
      context += `Care Type: ${patient.careType}\n`;
      context += `Status: ${patient.status}\n`;
      
      if (patient.medicalHistory) {
        context += `\nMedical History:\n${patient.medicalHistory}\n`;
      }
      
      if (patient.notes) {
        context += `\nNotes:\n${patient.notes}\n`;
      }
      
      return context;
    } catch (error) {
      console.error('Error getting patient context:', error);
      return "Error retrieving patient context";
    }
  }

  /**
   * Process a patient message and generate an AI response
   */
  async processPatientMessage(patientId: number, message: string): Promise<{ response: string, success: boolean }> {
    try {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not configured');
      }

      // Get patient context
      const patientContext = await this.getPatientContext(patientId);
      
      // Get chat history
      const recentHistory = await this.getRecentChatHistory(patientId);
      
      // Create system prompt with healthcare assistant persona
      const systemPrompt = `You are a compassionate healthcare assistant for ComplexCare CRM, a healthcare management system. 
      Your purpose is to provide supportive, informative responses to patients while respecting medical ethics and privacy.
      
      Guidelines:
      1. Be empathetic, patient, and compassionate in all responses
      2. Provide general health information when appropriate
      3. Explain medical concepts in simple, clear language
      4. NEVER diagnose conditions or prescribe treatments
      5. Refer medical questions to healthcare providers
      6. Emphasize the importance of following their care plan
      7. For urgent concerns, advise contacting their healthcare provider immediately
      8. Maintain a warm, supportive tone
      9. Respect patient privacy and confidentiality
      
      Patient Context (for reference only, DO NOT share this data with the patient):
      ${patientContext}
      
      Previous conversation history:
      ${recentHistory}`;

      // Make the API call using a model that exists in the Groq API
      const completion = await this.groqClient.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        model: "llama3-8b-8192", // Fixed model name for Groq API
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 0.9,
      });

      // Extract the generated text from the response
      const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request at this time.";
      
      // Log conversation to database
      await this.logConversation(patientId, message, aiResponse);
      
      return {
        response: aiResponse,
        success: true
      };
    } catch (error) {
      console.error('Error processing message with AI:', error);
      return {
        response: "I'm sorry, I'm having trouble responding right now. Please try again later or contact your healthcare provider directly.",
        success: false
      };
    }
  }

  /**
   * Log conversation to the database
   */
  private async logConversation(patientId: number, patientMessage: string, aiResponse: string): Promise<void> {
    try {
      await db.insert(chatHistory).values({
        patientId,
        patientMessage,
        aiResponse,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  }

  /**
   * Get recent chat history for a patient
   */
  private async getRecentChatHistory(patientId: number, limit: number = 10): Promise<string> {
    try {
      const history = await db.select()
        .from(chatHistory)
        .where(eq(chatHistory.patientId, patientId))
        .orderBy(desc(chatHistory.timestamp))
        .limit(limit);

      if (!history || history.length === 0) {
        return "No previous conversation history.";
      }

      // Format history as a string for context
      return history.reverse().map(entry => {
        return `Patient: ${entry.patientMessage}\nAssistant: ${entry.aiResponse}\n`;
      }).join('\n');
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return "Error retrieving conversation history.";
    }
  }

  /**
   * Get a patient's chat history from the database
   */
  async getChatHistory(patientId: number): Promise<{ history: any[], success: boolean }> {
    try {
      const history = await db.select()
        .from(chatHistory)
        .where(eq(chatHistory.patientId, patientId))
        .orderBy(asc(chatHistory.timestamp));

      return {
        history,
        success: true
      };
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return {
        history: [],
        success: false
      };
    }
  }
}

export const aiService = new AIService();
