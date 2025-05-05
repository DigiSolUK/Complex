import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

// Promisify filesystem methods
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Document types that can be stored
export type DocumentType = 
  | 'medical_record'
  | 'prescription'
  | 'consent_form'
  | 'care_plan'
  | 'lab_result'
  | 'referral_letter'
  | 'hospital_discharge'
  | 'patient_id'
  | 'insurance'
  | 'other';

// Document metadata
export interface DocumentMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  documentType: DocumentType;
  uploadedBy: number; // User ID
  patientId?: number;
  dateUploaded: Date;
  description?: string;
  tags?: string[];
  relatedEntityType?: string;
  relatedEntityId?: number;
}

interface StorageConfig {
  storageType: 'local' | 's3' | 'azure' | 'gcp';
  objectStorageEnabled: boolean;
  localStoragePath: string;
  tempUploadPath: string;
}

class DocumentStorage {
  private config: StorageConfig = {
    storageType: 'local', // Default to local storage
    objectStorageEnabled: false,
    localStoragePath: path.join(process.cwd(), 'uploads'),
    tempUploadPath: path.join(process.cwd(), 'temp')
  };

  constructor() {
    // Initialize storage directories
    this.initializeStorage();
  }

  /**
   * Configure the storage service with environment variables
   */
  public configureStorage(options: Partial<StorageConfig>) {
    this.config = { ...this.config, ...options };
    this.initializeStorage();
    return this;
  }

  /**
   * Check if object storage is configured and enabled
   */
  public isObjectStorageEnabled(): boolean {
    return this.config.objectStorageEnabled;
  }

  /**
   * Initialize storage directories
   */
  private async initializeStorage() {
    // Ensure local storage directories exist
    try {
      if (!(await existsAsync(this.config.localStoragePath))) {
        await mkdirAsync(this.config.localStoragePath, { recursive: true });
        console.log(`Created document storage directory: ${this.config.localStoragePath}`);
      }

      if (!(await existsAsync(this.config.tempUploadPath))) {
        await mkdirAsync(this.config.tempUploadPath, { recursive: true });
        console.log(`Created temporary upload directory: ${this.config.tempUploadPath}`);
      }
    } catch (error) {
      console.error('Error initializing document storage directories:', error);
    }
  }

  /**
   * Generate a unique document ID
   */
  private generateDocumentId(): string {
    return uuidv4();
  }

  /**
   * Store a document with the given metadata
   * Placeholder for future implementation
   */
  public async storeDocument(
    fileBuffer: Buffer,
    metadata: Omit<DocumentMetadata, 'id' | 'dateUploaded'>
  ): Promise<DocumentMetadata> {
    const documentId = this.generateDocumentId();
    const dateUploaded = new Date();

    const fullMetadata: DocumentMetadata = {
      ...metadata,
      id: documentId,
      dateUploaded
    };

    // Path to store the document
    const documentPath = path.join(this.config.localStoragePath, documentId);

    // Store the file locally (placeholder implementation)
    try {
      await writeFileAsync(documentPath, fileBuffer);

      // Store metadata alongside
      const metadataPath = `${documentPath}.json`;
      await writeFileAsync(metadataPath, JSON.stringify(fullMetadata, null, 2));

      console.log(`Document stored: ${documentId}`);
      return fullMetadata;
    } catch (error) {
      console.error('Error storing document:', error);
      throw new Error(`Failed to store document: ${error.message}`);
    }
  }

  /**
   * Retrieve a document by ID
   * Placeholder for future implementation
   */
  public async getDocumentById(documentId: string): Promise<{ buffer: Buffer; metadata: DocumentMetadata }> {
    // Path where the document is stored
    const documentPath = path.join(this.config.localStoragePath, documentId);
    const metadataPath = `${documentPath}.json`;

    try {
      // First check if file exists
      const fileExists = await existsAsync(documentPath);
      const metadataExists = await existsAsync(metadataPath);

      if (!fileExists || !metadataExists) {
        throw new Error(`Document ${documentId} not found`);
      }

      // Read the file and metadata
      const buffer = await readFileAsync(documentPath);
      const metadataStr = await readFileAsync(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataStr) as DocumentMetadata;

      return { buffer, metadata };
    } catch (error) {
      console.error(`Error retrieving document ${documentId}:`, error);
      throw new Error(`Failed to retrieve document: ${error.message}`);
    }
  }

  /**
   * Delete a document by ID
   * Placeholder for future implementation
   */
  public async deleteDocument(documentId: string): Promise<void> {
    // Path where the document is stored
    const documentPath = path.join(this.config.localStoragePath, documentId);
    const metadataPath = `${documentPath}.json`;

    try {
      // Delete the file and metadata
      await unlinkAsync(documentPath);
      await unlinkAsync(metadataPath);
      console.log(`Document deleted: ${documentId}`);
    } catch (error) {
      console.error(`Error deleting document ${documentId}:`, error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * List documents for a specific patient
   * Placeholder for future database implementation
   */
  public async listDocumentsByPatient(patientId: number): Promise<DocumentMetadata[]> {
    // This would typically query the database in a real implementation
    // For now, return an empty array
    return [];
  }
}

export const documentStorage = new DocumentStorage();
