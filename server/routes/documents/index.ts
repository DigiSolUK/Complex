import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { documentStorage, DocumentType } from '../../services/document-storage';
import { auth } from '../../auth';
import { storage } from '../../storage';
import { insertDocumentSchema } from '@shared/schema';
import { z } from 'zod';

const router = express.Router();

// Configure multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the temp directory for temporary storage
    const tempDir = path.join(process.cwd(), 'temp');
    // Ensure the directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent collisions
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  },
});

// File filter to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
  fileFilter,
});

// Route to handle document uploads
router.post('/upload', auth.isAuthenticated, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract document metadata from request body
    const documentType = req.body.documentType as DocumentType;
    const patientId = req.body.patientId ? parseInt(req.body.patientId) : undefined;
    const description = req.body.description;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const relatedEntityType = req.body.relatedEntityType;
    const relatedEntityId = req.body.relatedEntityId ? parseInt(req.body.relatedEntityId) : undefined;

    // Validate document type
    if (!documentType) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    // Read file from disk
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Store file using document storage service
    const document = await documentStorage.storeDocument(fileBuffer, {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      documentType,
      uploadedBy: req.user!.id,
      patientId,
      description,
      tags,
      relatedEntityType,
      relatedEntityId,
    });

    // Insert document record in database
    const documentRecord = await storage.createDocument({
      documentId: document.id,
      patientId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      documentType,
      uploadedBy: req.user!.id,
      storageLocation: `documents/${document.id}`, // Local path or object storage URL
      description,
      tags,
      relatedEntityType,
      relatedEntityId,
      metadata: {},
    });

    // Delete temporary file after processing
    fs.unlinkSync(filePath);

    // Record activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: 'upload',
      entityType: 'document',
      entityId: documentRecord.id,
      details: `Document uploaded: ${req.file.originalname} (${documentType})`,
    });

    res.status(201).json(documentRecord);
  } catch (error: any) {
    console.error('Document upload error:', error);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Clean up temp file on error
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid document data', errors: error.errors });
    }
    res.status(500).json({ message: error.message || 'Failed to upload document' });
  }
});

// Route to download/view a document
router.get('/:documentId', auth.isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    
    // Fetch document metadata from database
    const documentRecord = await storage.getDocumentById(documentId);
    if (!documentRecord) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Retrieve document from storage
    const document = await documentStorage.getDocumentById(documentRecord.documentId);

    // Set appropriate content type
    res.setHeader('Content-Type', documentRecord.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${documentRecord.originalName}"`);
    res.setHeader('Content-Length', documentRecord.size.toString());

    // Send file buffer
    res.send(document.buffer);
  } catch (error: any) {
    console.error('Document retrieval error:', error);
    res.status(500).json({ message: error.message || 'Failed to retrieve document' });
  }
});

// Route to list documents for a patient
router.get('/patient/:patientId', auth.isAuthenticated, async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.patientId);
    const documents = await storage.getDocumentsByPatient(patientId);
    res.json(documents);
  } catch (error: any) {
    console.error('Document list error:', error);
    res.status(500).json({ message: error.message || 'Failed to list documents' });
  }
});

// Route to delete a document
router.delete('/:documentId', auth.isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    
    // Fetch document metadata from database
    const documentRecord = await storage.getDocumentById(documentId);
    if (!documentRecord) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from storage
    await documentStorage.deleteDocument(documentRecord.documentId);

    // Delete from database
    await storage.deleteDocument(parseInt(documentId));

    // Log activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: 'delete',
      entityType: 'document',
      entityId: parseInt(documentId),
      details: `Document deleted: ${documentRecord.originalName}`,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Document deletion error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete document' });
  }
});

export default router;
