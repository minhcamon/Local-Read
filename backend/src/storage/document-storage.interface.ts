import type { Readable } from 'node:stream';

export interface StoredFileInfo {
  fileName: string;
  relativePath: string;
  absolutePath: string;
  sizeBytes: number;
  mimeType: string;
}

export interface IDocumentStorageService {
  saveFile(fileName: string, buffer: Buffer): Promise<StoredFileInfo>;
  getFileStream(relativePath: string): Promise<Readable>;
  deleteFile(relativePath: string): Promise<void>;
  fileExists(relativePath: string): Promise<boolean>;
  resolveSafePath(relativePath: string): string;
}
