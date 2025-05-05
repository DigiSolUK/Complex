import fetch from 'node-fetch';

class GroqService {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    if (!this.apiKey) {
      console.warn('GroqService: GROQ_API_KEY environment variable is not set');
    }
  }

  /**
   * Generate a care plan recommendation based on patient data
   */
  async generateCarePlanRecommendation(patientData: any): Promise<string> {
    try {
      const prompt = `
        Based on the following patient data, provide a comprehensive care plan recommendation.
        Focus on personalized care goals, treatment recommendations, and monitoring parameters.
        Use evidence-based approaches appropriate for the patient's conditions.
        Format the response as a structured care plan with sections for Goals, Interventions, and Monitoring.

        Patient Information:
        ${JSON.stringify(patientData, null, 2)}
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are an expert healthcare advisor providing evidence-based care plan recommendations for complex patients." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 1024,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Could not generate care plan recommendation";
    } catch (error) {
      console.error("Error generating care plan recommendation:", error);
      throw new Error("Failed to generate care plan recommendation");
    }
  }

  /**
   * Analyze patient notes and extract key clinical insights
   */
  async analyzePatientNotes(notes: string): Promise<any> {
    try {
      const prompt = `
        Analyze the following clinical notes and extract key medical insights:
        - Main complaints
        - Potential diagnoses
        - Risk factors
        - Treatment considerations
        - Follow-up recommendations

        Format the response as structured JSON.

        Clinical Notes:
        ${notes}
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a clinical documentation expert that extracts structured information from clinical notes." },
            { role: "user", content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 800,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Error analyzing patient notes:", error);
      throw new Error("Failed to analyze patient notes");
    }
  }

  /**
   * Generate appointment summary from raw meeting notes
   */
  async generateAppointmentSummary(notes: string): Promise<string> {
    try {
      const prompt = `
        Summarize the following appointment notes into a concise, professional clinical summary:
        
        ${notes}
        
        Include: 
        - Key complaints and symptoms
        - Assessment findings
        - Treatment plan
        - Follow-up instructions
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a healthcare documentation specialist who creates concise, accurate clinical summaries." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Could not generate appointment summary";
    } catch (error) {
      console.error("Error generating appointment summary:", error);
      throw new Error("Failed to generate appointment summary");
    }
  }

  /**
   * Analyze patient health trends from historical data
   */
  async analyzeHealthTrends(healthData: any): Promise<string> {
    try {
      const prompt = `
        Analyze the following patient health data and identify significant trends, patterns, or concerns:
        
        ${JSON.stringify(healthData, null, 2)}
        
        Provide insights on:
        - Significant changes in vital signs or lab values
        - Progress toward treatment goals
        - Early warning signs or risk factors
        - Recommendations for care plan adjustments
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a clinical data analyst who identifies meaningful health trends and provides actionable insights." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Could not analyze health trends";
    } catch (error) {
      console.error("Error analyzing health trends:", error);
      throw new Error("Failed to analyze health trends");
    }
  }

  /**
   * Generate medication interaction analysis
   */
  async analyzeMedicationInteractions(medications: string[]): Promise<string> {
    try {
      const prompt = `
        Analyze the following list of medications for potential interactions, side effects, 
        or monitoring considerations:
        
        ${medications.join("\n")}
        
        Provide:
        - Potential significant interactions
        - Common side effects to monitor
        - Special administration considerations
        - Recommendations for clinical monitoring
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a clinical pharmacist providing medication analysis and recommendations." },
            { role: "user", content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();

      return data.choices[0]?.message?.content || "Could not analyze medication interactions";
    } catch (error) {
      console.error("Error analyzing medication interactions:", error);
      throw new Error("Failed to analyze medication interactions");
    }
  }

  /**
   * Generic AI completion method for flexible use cases
   */
  async getAiCompletion(options: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: string;
  }): Promise<string> {
    try {
      const {
        prompt,
        systemPrompt = "You are a helpful healthcare AI assistant.",
        model = "llama3-70b-8192",
        temperature = 0.3,
        maxTokens = 1000,
        responseFormat
      } = options;

      const body: any = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature,
        max_tokens: maxTokens
      };

      // Add response format if specified
      if (responseFormat === 'json') {
        body.response_format = { type: "json_object" };
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Error getting AI completion:", error);
      throw new Error("Failed to get AI completion");
    }
  }
}

export const groqService = new GroqService();
