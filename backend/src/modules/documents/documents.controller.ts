import { Router, Request, Response, NextFunction } from 'express';
import { documentsService, DocumentsService } from './documents.service.js';

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
      const { stream, document } = await this.service.getDocumentStream(req.params.id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', document.fileSizeBytes.toString());
      res.setHeader('Content-Disposition', 'inline');
      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }
}

export const documentsController = new DocumentsController();
