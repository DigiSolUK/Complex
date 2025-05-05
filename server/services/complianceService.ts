import { groqService } from './groqService';

interface ComplianceResult {
  score: number; // 0-100
  areas: ComplianceArea[];
  recommendations: string[];
  overallStatus: 'compliant' | 'at-risk' | 'non-compliant';
  lastUpdated: Date;
}

interface ComplianceArea {
  name: string;
  score: number; // 0-100
  findings: string[];
  status: 'compliant' | 'at-risk' | 'non-compliant';
  regulation: string;
}

interface ComplianceData {
  patientData: any;
  carePlanData: any;
  appointmentData: any;
  documentationData: any;
  auditLogs: any[];
}

class ComplianceService {
  /**
   * Analyze compliance status for patient data and care plans
   */
  async analyzeCompliance(data: ComplianceData): Promise<ComplianceResult> {
    try {
      const prompt = `
        Analyze the following healthcare data for regulatory compliance issues related to patient care documentation, information handling, and treatment protocols.
        Focus on compliance with healthcare regulations including HIPAA, HITECH, and NHS Digital standards.
        
        Patient Data:
        ${JSON.stringify(data.patientData, null, 2)}
        
        Care Plan Data:
        ${JSON.stringify(data.carePlanData, null, 2)}
        
        Appointment Data:
        ${JSON.stringify(data.appointmentData, null, 2)}
        
        Documentation Data:
        ${JSON.stringify(data.documentationData, null, 2)}
        
        Audit Logs (sample):
        ${JSON.stringify(data.auditLogs.slice(0, 5), null, 2)}
        
        Provide a detailed analysis in JSON format with the following structure:
        {
          "score": number from 0-100,
          "areas": [
            {
              "name": "area name",
              "score": number from 0-100,
              "findings": ["detailed findings"],
              "status": "compliant" or "at-risk" or "non-compliant",
              "regulation": "relevant regulation"
            }
          ],
          "recommendations": ["actionable recommendations"],
          "overallStatus": "compliant" or "at-risk" or "non-compliant"
        }
      `;

      const analysisJson = await groqService.getAiCompletion({
        prompt,
        systemPrompt: "You are a healthcare compliance expert who evaluates medical data for regulatory compliance. You provide detailed, accurate compliance reports with actionable insights. Always respond with a valid JSON object that matches the requested format exactly.",
        temperature: 0.1,
        model: "llama3-70b-8192",
        responseFormat: "json"
      });

      try {
        const analysis = JSON.parse(analysisJson);
        return {
          ...analysis,
          lastUpdated: new Date()
        };
      } catch (parseError) {
        console.error("Error parsing compliance analysis JSON:", parseError);
        throw new Error("Failed to parse compliance analysis result");
      }
    } catch (error) {
      console.error("Error analyzing compliance:", error);
      throw new Error("Failed to analyze compliance");
    }
  }

  /**
   * Generate a compliance report for audit purposes
   */
  async generateComplianceReport(complianceResult: ComplianceResult, organizationInfo: any): Promise<string> {
    try {
      const prompt = `
        Generate a formal healthcare compliance report based on the following compliance analysis results:
        
        ${JSON.stringify(complianceResult, null, 2)}
        
        Organization Information:
        ${JSON.stringify(organizationInfo, null, 2)}
        
        The report should include:
        1. Executive Summary
        2. Methodology
        3. Detailed Findings by Area
        4. Risk Assessment
        5. Recommendations
        6. Action Plan
        7. Conclusion
        
        Format the report professionally with clear headings and structured content suitable for presentation to regulatory authorities.
      `;

      const report = await groqService.getAiCompletion({
        prompt,
        systemPrompt: "You are a healthcare compliance officer creating formal compliance reports. You write detailed, professional reports that would satisfy regulatory requirements and auditors.",
        temperature: 0.2,
        model: "llama3-70b-8192"
      });

      return report;
    } catch (error) {
      console.error("Error generating compliance report:", error);
      throw new Error("Failed to generate compliance report");
    }
  }

  /**
   * Analyze patient data management for privacy compliance
   */
  async analyzePrivacyCompliance(dataAccessLogs: any[], patientConsents: any[]): Promise<any> {
    try {
      const prompt = `
        Analyze the following data access logs and patient consent records for privacy compliance issues:
        
        Data Access Logs:
        ${JSON.stringify(dataAccessLogs, null, 2)}
        
        Patient Consent Records:
        ${JSON.stringify(patientConsents, null, 2)}
        
        Evaluate:
        1. Unauthorized access incidents
        2. Access pattern anomalies
        3. Consent validation issues
        4. Data handling concerns
        5. Retention policy compliance
        
        Provide a structured analysis with identified issues, risk levels, and recommended actions.
        Format response as a JSON object with keys: issues, riskAreas, recommendations, overallRiskLevel.
      `;

      const analysisJson = await groqService.getAiCompletion({
        prompt,
        systemPrompt: "You are a data privacy officer specializing in healthcare data protection regulations including HIPAA, GDPR, and UK data protection laws. You analyze data access patterns to identify privacy and security risks.",
        temperature: 0.1,
        model: "llama3-70b-8192",
        responseFormat: "json"
      });

      return JSON.parse(analysisJson);
    } catch (error) {
      console.error("Error analyzing privacy compliance:", error);
      throw new Error("Failed to analyze privacy compliance");
    }
  }

  /**
   * Generate regulatory compliance documentation for care plans
   */
  async generateComplianceDocumentation(carePlan: any, regulationType: string): Promise<string> {
    try {
      const prompt = `
        Generate comprehensive compliance documentation for the following care plan that adheres to ${regulationType} standards:
        
        ${JSON.stringify(carePlan, null, 2)}
        
        The documentation should include:
        1. Regulatory justification for each intervention
        2. Evidence-based practice references
        3. Compliance with clinical guidelines
        4. Required documentation elements for ${regulationType}
        5. Risk management considerations
        
        Format the documentation as a professional clinical document suitable for regulatory submission.
      `;

      const documentation = await groqService.getAiCompletion({
        prompt,
        systemPrompt: "You are a healthcare compliance documentation specialist who creates thorough, accurate regulatory documentation that satisfies healthcare compliance requirements.",
        temperature: 0.2,
        model: "llama3-70b-8192"
      });

      return documentation;
    } catch (error) {
      console.error("Error generating compliance documentation:", error);
      throw new Error("Failed to generate compliance documentation");
    }
  }
}

export const complianceService = new ComplianceService();
