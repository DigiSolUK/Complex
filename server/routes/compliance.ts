import express from 'express';
import { complianceService } from '../services/complianceService';
import { auth } from '../auth';
import { storage } from '../storage';

const router = express.Router();

// Middleware to check authentication - require admin or higher for compliance features
router.use(auth.hasRole(['admin', 'superadmin']));

/**
 * Get the latest compliance analysis, if any
 */
router.get('/latest', async (req, res) => {
  try {
    // In a real implementation, this would fetch the latest compliance result from the database
    // For now, we'll return a sample result or null if none exists
    const latestAnalysis = await storage.getLatestComplianceAnalysis();
    
    if (!latestAnalysis) {
      return res.status(404).json({ error: 'No compliance analysis found' });
    }
    
    res.json(latestAnalysis);
  } catch (error) {
    console.error('Error fetching latest compliance analysis:', error);
    res.status(500).json({ error: 'Failed to fetch latest compliance analysis' });
  }
});

/**
 * Analyze organizational compliance status based on healthcare data
 */
router.post('/analyze', async (req, res) => {
  try {
    const complianceData = req.body;
    
    if (!complianceData) {
      return res.status(400).json({ error: 'Compliance data is required' });
    }
    
    const complianceResult = await complianceService.analyzeCompliance(complianceData);
    res.json(complianceResult);
  } catch (error) {
    console.error('Error analyzing compliance:', error);
    res.status(500).json({ error: 'Failed to analyze compliance' });
  }
});

/**
 * Generate compliance report based on analysis results
 */
router.post('/generate-report', async (req, res) => {
  try {
    const { complianceResult, organizationInfo } = req.body;
    
    if (!complianceResult || !organizationInfo) {
      return res.status(400).json({ error: 'Compliance result and organization info are required' });
    }
    
    const report = await complianceService.generateComplianceReport(complianceResult, organizationInfo);
    res.json({ report });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

/**
 * Analyze privacy compliance based on data access and consent records
 */
router.post('/privacy-analysis', async (req, res) => {
  try {
    const { dataAccessLogs, patientConsents } = req.body;
    
    if (!dataAccessLogs || !patientConsents) {
      return res.status(400).json({ error: 'Data access logs and patient consents are required' });
    }
    
    const analysis = await complianceService.analyzePrivacyCompliance(dataAccessLogs, patientConsents);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing privacy compliance:', error);
    res.status(500).json({ error: 'Failed to analyze privacy compliance' });
  }
});

/**
 * Generate regulatory compliance documentation for care plans
 */
router.post('/generate-documentation', async (req, res) => {
  try {
    const { carePlan, regulationType } = req.body;
    
    if (!carePlan || !regulationType) {
      return res.status(400).json({ error: 'Care plan and regulation type are required' });
    }
    
    const documentation = await complianceService.generateComplianceDocumentation(carePlan, regulationType);
    res.json({ documentation });
  } catch (error) {
    console.error('Error generating compliance documentation:', error);
    res.status(500).json({ error: 'Failed to generate compliance documentation' });
  }
});

export default router;
