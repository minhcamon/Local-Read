import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import type { Readable } from 'node:stream';
import type { IDocumentStorageService, StoredFileInfo } from './document-storage.interface.js';
import { SecurityError, NotFoundError, BadRequestError } from '../common/errors/AppError.js';
import { config } from '../config/index.js';

export class LocalFileStorageService implements IDocumentStorageService {
  private readonly baseDir: string;

  constructor(baseDir: string = config.storage.baseDir) {
    this.baseDir = path.resolve(baseDir);
    this.ensureBaseDirSync();
  }

  private ensureBaseDirSync(): void {
    if (!fsSync.existsSync(this.baseDir)) {
      fsSync.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public resolveSafePath(relativePath: string): string {
    const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.resolve(this.baseDir, normalized);

    if (!absolutePath.startsWith(this.baseDir)) {
      throw new SecurityError('Access denied: Path traversal attempt detected');
    }

    return absolutePath;
  }

  public async saveFile(originalName: string, buffer: Buffer): Promise<StoredFileInfo> {
    if (buffer.length > config.storage.maxFileSize) {
      throw new BadRequestError(`File exceeds maximum allowed size of ${config.storage.maxFileSize} bytes`);
    }

    // Verify PDF Magic Bytes: %PDF-
    const header = buffer.subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') {
      throw new BadRequestError('Invalid file format: File must be a valid PDF');
    }

    const sanitizedBase = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `${Date.now()}_${sanitizedBase}`;
    const targetPath = path.join(this.baseDir, uniqueName);

    await fs.writeFile(targetPath, buffer);

    return {
      fileName: uniqueName,
      relativePath: uniqueName,
      absolutePath: targetPath,
      sizeBytes: buffer.length,
      mimeType: 'application/pdf',
    };
  }

  public async getFileStream(relativePath: string): Promise<Readable> {
    const safePath = this.resolveSafePath(relativePath);
    if (!fsSync.existsSync(safePath)) {
      throw new NotFoundError('Requested document file does not exist on disk');
    }
    return fsSync.createReadStream(safePath);
  }

  public async deleteFile(relativePath: string): Promise<void> {
    const safePath = this.resolveSafePath(relativePath);
    if (fsSync.existsSync(safePath)) {
      await fs.unlink(safePath);
    }
  }

  public async fileExists(relativePath: string): Promise<boolean> {
    const safePath = this.resolveSafePath(relativePath);
    return fsSync.existsSync(safePath);
  }
}

export const documentStorage = new LocalFileStorageService();
