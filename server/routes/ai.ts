import express from 'express';
import { groqService } from '../services/groqService';
import { auth } from '../auth';

const router = express.Router();

// Middleware to check authentication
router.use(auth.isAuthenticated);

/**
 * Generate care plan recommendations based on patient data
 */
router.post('/generate-care-plan', async (req, res) => {
  try {
    const patientData = req.body;
    
    if (!patientData) {
      return res.status(400).json({ error: 'Patient data is required' });
    }
    
    const recommendation = await groqService.generateCarePlanRecommendation(patientData);
    res.json({ recommendation });
  } catch (error) {
    console.error('Error generating care plan:', error);
    res.status(500).json({ error: 'Failed to generate care plan recommendation' });
  }
});

/**
 * Analyze patient clinical notes
 */
router.post('/analyze-notes', async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }
    
    const analysis = await groqService.analyzePatientNotes(notes);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing notes:', error);
    res.status(500).json({ error: 'Failed to analyze patient notes' });
  }
});

/**
 * Generate appointment summary
 */
router.post('/appointment-summary', async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }
    
    const summary = await groqService.generateAppointmentSummary(notes);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating appointment summary:', error);
    res.status(500).json({ error: 'Failed to generate appointment summary' });
  }
});

/**
 * Analyze health trends from patient data
 */
router.post('/analyze-health-trends', async (req, res) => {
  try {
    const healthData = req.body;
    
    if (!healthData) {
      return res.status(400).json({ error: 'Health data is required' });
    }
    
    const analysis = await groqService.analyzeHealthTrends(healthData);
    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing health trends:', error);
    res.status(500).json({ error: 'Failed to analyze health trends' });
  }
});

/**
 * Analyze medication interactions
 */
router.post('/medication-interactions', async (req, res) => {
  try {
    const { medications } = req.body;
    
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ error: 'Valid medications array is required' });
    }
    
    const analysis = await groqService.analyzeMedicationInteractions(medications);
    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing medication interactions:', error);
    res.status(500).json({ error: 'Failed to analyze medication interactions' });
  }
});

export default router;
