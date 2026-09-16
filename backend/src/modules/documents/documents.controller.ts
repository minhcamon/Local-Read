import fs from 'node:fs';
import { Router, Request, Response, NextFunction } from 'express';
import { documentsService, DocumentsService } from './documents.service.js';
import { documentStorage } from '../../storage/local-file-storage.service.js';

export class DocumentsController {
  public router: Router = Router();

  constructor(private readonly service: DocumentsService = documentsService) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/:id', this.getDocumentById.bind(this));
    this.router.get('/:id/file', this.streamDocumentFile.bind(this));
  }

  public async getDocumentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const document = await this.service.getDocumentById(req.params.id);
      res.json({
        data: {
          id: document.id,
          bookId: document.bookId,
          format: document.format,
          fileSizeBytes: document.fileSizeBytes,
          createdAt: document.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async streamDocumentFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const document = await this.service.getDocumentById(req.params.id);
      const safePath = documentStorage.resolveSafePath(document.filePath);
      const fileSize = document.fileSizeBytes;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize || start > end) {
          res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
          return;
        }

        const chunksize = end - start + 1;
        const fileStream = fs.createReadStream(safePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
        });

        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
        });

        const fileStream = fs.createReadStream(safePath);
        fileStream.pipe(res);
      }
    } catch (err) {
      next(err);
    }
  }
}

export const documentsController = new DocumentsController();
