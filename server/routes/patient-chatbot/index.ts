import { Router, Request, Response } from "express";
import { z } from "zod";
import { storage } from "../../storage";
import { chatHistory } from "@shared/schema";

// Initialize Groq client if GROQ_API_KEY is available
import { Groq } from "groq-sdk";
const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null;

const router = Router();

// Schema for chat request validation
const ChatRequestSchema = z.object({
  patientId: z.number(),
  message: z.string().min(1).max(1000),
});

// AI context system prompt
const SYSTEM_PROMPT = `You are a compassionate and helpful healthcare assistant for patients using the ComplexCare CRM system. 
Your role is to provide friendly, supportive, and informative responses to patients about their healthcare journey.

Guidelines:
- Be warm, empathetic and compassionate in your tone
- Provide clear, concise information about care plans, medications, and appointments
- When you don't know specific details about a patient's care, acknowledge this and suggest they speak with their healthcare provider
- Never provide specific medical advice or diagnoses
- Respect patient privacy and confidentiality
- Use simple, non-technical language
- Format your responses in a way that's easy to read, using short paragraphs and bullet points when appropriate
- If the patient seems distressed, acknowledge their feelings and suggest contacting their care team directly

Focus on being a supportive companion in their healthcare journey while maintaining appropriate boundaries.`;

// GET /api/patient-chatbot/history/:patientId - Get chat history for a patient
router.get("/history/:patientId", async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      return res.status(400).json({ success: false, message: "Invalid patient ID" });
    }

    // Fetch chat history
    const history = await storage.getChatHistoryForPatient(patientId);
    
    // Format history for frontend
    const formattedHistory = history.map(entry => ({
      type: "patient",
      content: entry.patientMessage,
      timestamp: entry.timestamp,
      // Add any additional metadata needed
    })).flatMap((patientMsg, index) => {
      // Each patient message is followed by an assistant message
      // Make sure the index is valid before accessing history[index]
      if (index < history.length) {
        return [
          patientMsg,
          {
            type: "assistant",
            content: history[index].aiResponse,
            timestamp: history[index].timestamp,
          }
        ];
      }
      return [patientMsg];
    });

    return res.status(200).json({
      success: true,
      history: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat history",
    });
  }
});

// POST /api/patient-chatbot/chat - Process chat message and get AI response
router.post("/chat", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = ChatRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validationResult.error.errors,
      });
    }

    const { patientId, message } = validationResult.data;

    // Check if patient exists
    const patient = await storage.getPatient(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check if Groq API is available
    if (!groq) {
      return res.status(503).json({
        success: false,
        message: "AI service is not available",
      });
    }

    // Get patient context for better personalized responses
    const patientContext = await getPatientContext(patientId);

    // Call Groq API for response
    const aiResponse = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Using Llama 3 model for compassionate responses
      messages: [
        { role: "system", content: SYSTEM_PROMPT + '\n' + patientContext },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    const responseText = aiResponse.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";

    // Save chat interaction to database
    await storage.saveChatInteraction({
      patientId,
      patientMessage: message,
      aiResponse: responseText,
      metadata: {}, // Optional metadata if needed
    });

    return res.status(200).json({
      success: true,
      response: responseText,
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process your message",
    });
  }
});

// Helper function to get patient context
async function getPatientContext(patientId: number): Promise<string> {
  try {
    // Get patient details
    const patient = await storage.getPatient(patientId);
    if (!patient) return "";

    // Get active care plan if available
    const carePlans = await storage.getActiveCarePlansForPatient(patientId);
    const activePlan = carePlans.length > 0 ? carePlans[0] : null;

    // Get upcoming appointments
    const appointments = await storage.getUpcomingAppointmentsForPatient(patientId);

    // Construct context string
    let context = `
      Patient Context:
      - Name: ${patient.name}
      - Care Type: ${patient.careType}
      - Status: ${patient.status}
    `;

    if (activePlan) {
      context += `
      - Active Care Plan: ${activePlan.title}
      - Care Plan Status: ${activePlan.status}
      `;
    }

    if (appointments.length > 0) {
      context += `
      - Next Appointment: ${appointments[0].title} on ${new Date(appointments[0].dateTime).toLocaleDateString()} at ${new Date(appointments[0].dateTime).toLocaleTimeString()}
      `;
    }

    return context;
  } catch (error) {
    console.error("Error getting patient context:", error);
    return "";
  }
}

export default router;
