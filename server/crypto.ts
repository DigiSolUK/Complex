import crypto from "crypto";

class Crypto {
  private readonly saltLength: number = 16;
  private readonly keyLength: number = 64;
  private readonly iterations: number = 10000;
  private readonly digest: string = "sha512";
  private readonly encryptionKey: Buffer;
  private readonly algorithm: string = "aes-256-gcm";
  private readonly ivLength: number = 16;
  private readonly authTagLength: number = 16;

  constructor() {
    // In a real application, this would be a secure environment variable
    const key = process.env.ENCRYPTION_KEY || "this-is-a-secret-key-for-development-only";
    this.encryptionKey = crypto.scryptSync(key, "salt", 32);
  }

  /**
   * Hash a password with a random salt
   * @param password The plain text password to hash
   * @returns A string in the format 'salt:hash'
   */
  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(this.saltLength).toString("hex");
      
      crypto.pbkdf2(
        password,
        salt,
        this.iterations,
        this.keyLength,
        this.digest,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            const hash = derivedKey.toString("hex");
            resolve(`${salt}:${hash}`);
          }
        }
      );
    });
  }

  /**
   * Verify a password against a hash
   * @param password The plain text password to verify
   * @param storedHash The hash to compare with, in the format 'salt:hash'
   * @returns Boolean indicating if the password matches
   */
  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, hash] = storedHash.split(":");
      
      crypto.pbkdf2(
        password,
        salt,
        this.iterations,
        this.keyLength,
        this.digest,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            const newHash = derivedKey.toString("hex");
            resolve(newHash === hash);
          }
        }
      );
    });
  }

  /**
   * Encrypt sensitive data
   * @param data The data to encrypt
   * @returns Encrypted data with IV and auth tag
   */
  encrypt(data: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv) as crypto.CipherGCM;
    
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encryptedData
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   * @param encryptedData The encrypted data with IV and auth tag
   * @returns The decrypted data
   */
  decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, data] = encryptedData.split(":");
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  }
}

export const cryptoService = new Crypto();
