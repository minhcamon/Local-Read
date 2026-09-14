import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs/promises';
import { LocalFileStorageService } from './local-file-storage.service.js';
import { SecurityError, BadRequestError } from '../common/errors/AppError.js';

describe('LocalFileStorageService', () => {
  const testStorageDir = path.resolve(process.cwd(), 'storage_test_temp');
  let storage: LocalFileStorageService;

  beforeEach(async () => {
    await fs.mkdir(testStorageDir, { recursive: true });
    storage = new LocalFileStorageService(testStorageDir);
  });

  afterEach(async () => {
    try {
      await fs.rm(testStorageDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  it('should prevent path traversal attempts outside storage boundary', () => {
    expect(() => {
      storage.resolveSafePath('../../etc/passwd');
    }).toThrow(SecurityError);

    expect(() => {
      storage.resolveSafePath('..\\..\\windows\\system32');
    }).toThrow(SecurityError);
  });

  it('should accept valid safe relative paths', () => {
    const safePath = storage.resolveSafePath('valid_file.pdf');
    expect(safePath.startsWith(testStorageDir)).toBe(true);
  });

  it('should reject files missing %PDF- magic bytes', async () => {
    const fakeBuffer = Buffer.from('NOT A PDF FILE');
    await expect(storage.saveFile('test.pdf', fakeBuffer)).rejects.toThrow(BadRequestError);
  });

  it('should successfully save valid PDF buffer and return stored info', async () => {
    const validPdfBuffer = Buffer.from('%PDF-1.4\n%EOF');
    const stored = await storage.saveFile('my-book.pdf', validPdfBuffer);

    expect(stored).toBeDefined();
    expect(stored.sizeBytes).toBe(validPdfBuffer.length);
    expect(stored.mimeType).toBe('application/pdf');
    expect(await storage.fileExists(stored.relativePath)).toBe(true);
  });
});
