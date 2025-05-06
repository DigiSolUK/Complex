import { Router } from 'express';
import { auth } from '../auth';
import { deviceReadings, wearableDevices } from '@shared/schema';
import { db } from '../db';
import { eq, and, desc, gte } from 'drizzle-orm';

const router = Router();

// Get all wearable devices for a patient
router.get('/patients/:patientId/wearables', auth.isAuthenticated, async (req, res) => {
  try {
    const patientId = parseInt(req.params.patientId);

    if (isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const devices = await db.select().from(wearableDevices)
      .where(eq(wearableDevices.patientId, patientId))
      .orderBy(desc(wearableDevices.lastSyncDate));

    res.json(devices);
  } catch (error) {
    console.error('Error fetching wearable devices:', error);
    res.status(500).json({ message: 'Failed to fetch wearable devices' });
  }
});

// Get a specific wearable device
router.get('/wearables/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);

    if (isNaN(deviceId)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }

    const [device] = await db.select().from(wearableDevices)
      .where(eq(wearableDevices.id, deviceId));

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    console.error('Error fetching wearable device:', error);
    res.status(500).json({ message: 'Failed to fetch wearable device' });
  }
});

// Add a new wearable device to a patient
router.post('/patients/:patientId/wearables', auth.isAuthenticated, async (req, res) => {
  try {
    const patientId = parseInt(req.params.patientId);

    if (isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const { deviceType, manufacturer, model, serialNumber } = req.body;

    if (!deviceType || !manufacturer || !model || !serialNumber) {
      return res.status(400).json({ message: 'Missing required device information' });
    }

    // Check if the device already exists for this patient or any other patient
    const [existingDevice] = await db.select().from(wearableDevices)
      .where(eq(wearableDevices.serialNumber, serialNumber));

    if (existingDevice) {
      return res.status(409).json({ message: 'A device with this serial number is already registered' });
    }

    // Create the new device
    const [newDevice] = await db.insert(wearableDevices).values({
      patientId,
      deviceType,
      manufacturer,
      model,
      serialNumber,
      connectionStatus: 'pairing', // Initial status
      activationDate: new Date(),
      createdAt: new Date(),
    }).returning();

    // Simulate device connection process
    // In a real app, this would involve API calls to the device manufacturer's API
    setTimeout(async () => {
      await db.update(wearableDevices)
        .set({
          connectionStatus: 'connected',
          lastSyncDate: new Date(),
          batteryStatus: Math.floor(Math.random() * 50) + 50, // Random battery 50-100%
          updatedAt: new Date(),
        })
        .where(eq(wearableDevices.id, newDevice.id));
    }, 3000);

    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error adding wearable device:', error);
    res.status(500).json({ message: 'Failed to add wearable device' });
  }
});

// Sync a wearable device to get the latest data
router.post('/wearables/:id/sync', auth.isAuthenticated, async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);

    if (isNaN(deviceId)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }

    const [device] = await db.select().from(wearableDevices)
      .where(eq(wearableDevices.id, deviceId));

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // In a real app, this would call the device manufacturer's API
    // to get the latest data. Here we simulate the update:
    const [updatedDevice] = await db.update(wearableDevices)
      .set({
        lastSyncDate: new Date(),
        batteryStatus: Math.max(0, (device.batteryStatus || 100) - Math.floor(Math.random() * 10)), // Simulate battery usage
        updatedAt: new Date(),
      })
      .where(eq(wearableDevices.id, deviceId))
      .returning();

    // Simulate getting new readings
    // In reality, these would come from the device's API
    await generateMockReadings(device);

    res.json(updatedDevice);
  } catch (error) {
    console.error('Error syncing wearable device:', error);
    res.status(500).json({ message: 'Failed to sync wearable device' });
  }
});

// Delete a wearable device
router.delete('/wearables/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);

    if (isNaN(deviceId)) {
      return res.status(400).json({ message: 'Invalid device ID' });
    }

    // Check if the device exists
    const [device] = await db.select().from(wearableDevices)
      .where(eq(wearableDevices.id, deviceId));

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Delete all readings first to avoid foreign key constraint issues
    await db.delete(deviceReadings)
      .where(eq(deviceReadings.deviceId, deviceId));

    // Delete the device
    await db.delete(wearableDevices)
      .where(eq(wearableDevices.id, deviceId));

    res.status(200).json({ message: 'Device removed successfully' });
  } catch (error) {
    console.error('Error deleting wearable device:', error);
    res.status(500).json({ message: 'Failed to delete wearable device' });
  }
});

// Get device readings for a specific device
router.get('/patients/:patientId/wearables/:deviceId/readings', auth.isAuthenticated, async (req, res) => {
  try {
    const deviceId = parseInt(req.params.deviceId);
    const patientId = parseInt(req.params.patientId);
    const readingType = req.query.type as string;
    const timeRange = req.query.timeRange as string || '24h';

    if (isNaN(deviceId) || isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid ID parameters' });
    }

    // Calculate time range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '24h':
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
    }

    let query = db.select().from(deviceReadings)
      .where(
        and(
          eq(deviceReadings.deviceId, deviceId),
          eq(deviceReadings.patientId, patientId),
          gte(deviceReadings.timestamp, startDate)
        )
      )
      .orderBy(deviceReadings.timestamp);

    // Add reading type filter if provided
    if (readingType) {
      query = query.where(eq(deviceReadings.readingType, readingType));
    }

    const readings = await query;

    res.json(readings);
  } catch (error) {
    console.error('Error fetching device readings:', error);
    res.status(500).json({ message: 'Failed to fetch device readings' });
  }
});

// Function to simulate generating readings for a device
// In a real app, this would be replaced with actual API calls to the device
async function generateMockReadings(device: any) {
  // Only generate for certain device types to avoid too much data
  const readingTypes = [];
  
  switch (device.deviceType) {
    case 'smartwatch':
      readingTypes.push(
        { type: 'heart_rate', unit: 'bpm', baseValue: 75, variance: 15 },
        { type: 'steps', unit: 'steps', baseValue: 8000, variance: 3000 }
      );
      break;
    case 'fitness_tracker':
      readingTypes.push(
        { type: 'heart_rate', unit: 'bpm', baseValue: 75, variance: 15 },
        { type: 'steps', unit: 'steps', baseValue: 8000, variance: 3000 }
      );
      break;
    case 'glucose_monitor':
      readingTypes.push(
        { type: 'blood_glucose', unit: 'mg/dL', baseValue: 100, variance: 40 }
      );
      break;
    case 'blood_pressure_monitor':
      readingTypes.push(
        { 
          type: 'blood_pressure', 
          unit: 'mmHg', 
          baseValue: 120, // Systolic
          variance: 20,
          metricGroup: 'systolic'
        },
        { 
          type: 'blood_pressure', 
          unit: 'mmHg', 
          baseValue: 80, // Diastolic
          variance: 10,
          metricGroup: 'diastolic'
        },
      );
      break;
    case 'heart_monitor':
      readingTypes.push(
        { type: 'heart_rate', unit: 'bpm', baseValue: 75, variance: 15 }
      );
      break;
    case 'pulse_oximeter':
      readingTypes.push(
        { type: 'oxygen_saturation', unit: '%', baseValue: 97, variance: 3 }
      );
      break;
    case 'thermometer':
      readingTypes.push(
        { type: 'temperature', unit: '°C', baseValue: 36.8, variance: 1 }
      );
      break;
    default:
      return; // Skip for unrecognized device types
  }
  
  // Get the current time
  const now = new Date();
  
  // Generate readings for the past hour at intervals
  const readings = [];
  
  for (let i = 0; i < readingTypes.length; i++) {
    const { type, unit, baseValue, variance, metricGroup } = readingTypes[i];
    
    // Generate between 1-5 new readings
    const numReadings = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < numReadings; j++) {
      // Random time in the past hour
      const minutesAgo = Math.floor(Math.random() * 60);
      const readingTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
      
      // Generate a value with some random variation
      const isDecimal = baseValue % 1 !== 0;
      let value;
      
      if (isDecimal) {
        value = (baseValue + (Math.random() * 2 - 1) * variance).toFixed(1);
      } else {
        value = Math.round(baseValue + (Math.random() * 2 - 1) * variance).toString();
      }
      
      // Determine status
      let readingStatus = 'normal';
      
      // Add reading to database
      readings.push({
        deviceId: device.id,
        patientId: device.patientId,
        readingType: type,
        value,
        unit,
        timestamp: readingTime,
        readingStatus,
        metricGroup,
        verified: false,
        createdAt: new Date(),
      });
    }
  }
  
  if (readings.length > 0) {
    try {
      await db.insert(deviceReadings).values(readings);
    } catch (error) {
      console.error('Error inserting mock readings:', error);
    }
  }
}

export default router;