import { Router, Request, Response, NextFunction } from 'express';
import { highlightsService, HighlightsService } from './highlights.service.js';
import { CreateHighlightSchema } from './dto/index.js';
import { BadRequestError, NotFoundError } from '../../common/errors/AppError.js';

export class HighlightsController {
  public router: Router = Router();

  constructor(private readonly service: HighlightsService = highlightsService) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/:documentId', this.getHighlights.bind(this));
    this.router.post('/:documentId', this.createHighlight.bind(this));
    this.router.delete('/:documentId/:highlightId', this.deleteHighlight.bind(this));
  }

  public async getHighlights(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const highlights = await this.service.getHighlightsByDocument(req.params.documentId);
      res.json({ data: highlights });
    } catch (err) {
      next(err);
    }
  }

  public async createHighlight(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreateHighlightSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new BadRequestError('Invalid highlight format', parsed.error.format());
      }

      const created = await this.service.createHighlight(req.params.documentId, parsed.data);
      res.status(201).json({ data: created });
    } catch (err) {
      next(err);
    }
  }

  public async deleteHighlight(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await this.service.deleteHighlight(req.params.highlightId);
      if (!deleted) {
        throw new NotFoundError(`Highlight with ID "${req.params.highlightId}" not found`);
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const highlightsController = new HighlightsController();
