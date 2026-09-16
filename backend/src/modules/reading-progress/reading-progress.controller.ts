import { Router, Request, Response, NextFunction } from 'express';
import { readingProgressService, ReadingProgressService } from './reading-progress.service.js';
import { SaveProgressSchema } from './dto/index.js';
import { BadRequestError } from '../../common/errors/AppError.js';

export class ReadingProgressController {
  public router: Router = Router();

  constructor(private readonly service: ReadingProgressService = readingProgressService) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/:documentId', this.getProgress.bind(this));
    this.router.put('/:documentId', this.saveProgress.bind(this));
    this.router.get('/:documentId/progress', this.getProgress.bind(this));
    this.router.put('/:documentId/progress', this.saveProgress.bind(this));
  }

  public async getProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const progress = await this.service.getProgressByDocumentId(req.params.documentId);
      res.json({ data: progress });
    } catch (err) {
      next(err);
    }
  }

  public async saveProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = SaveProgressSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new BadRequestError('Invalid reading progress format', parsed.error.format());
      }

      const updated = await this.service.saveProgress(req.params.documentId, parsed.data);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const readingProgressController = new ReadingProgressController();
