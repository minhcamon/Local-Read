import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { booksService, BooksService } from './books.service.js';
import { ImportBookSchema, GetBooksQuerySchema } from './dto/index.js';
import { BadRequestError } from '../../common/errors/AppError.js';

const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } });

export class BooksController {
  public router: Router = Router();

  constructor(private readonly service: BooksService = booksService) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/', this.getAllBooks.bind(this));
    this.router.get('/:id', this.getBookById.bind(this));
    this.router.delete('/:id', this.deleteBook.bind(this));
    this.router.post('/import', upload.single('file'), this.importBook.bind(this));
  }

  public async getAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParsed = GetBooksQuerySchema.safeParse(req.query);
      const query = queryParsed.success ? queryParsed.data : undefined;
      const books = await this.service.getAllBooks(query);
      res.json({ data: books });
    } catch (err) {
      next(err);
    }
  }

  public async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await this.service.getBookById(req.params.id);
      res.json({ data: book });
    } catch (err) {
      next(err);
    }
  }

  public async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.deleteBook(req.params.id);
      res.json({ success: true, message: 'Book and associated documents deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async importBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new BadRequestError('PDF file is required in "file" field');
      }

      const parsed = ImportBookSchema.safeParse({
        title: req.body.title || req.file.originalname.replace(/\.[^/.]+$/, ''),
        author: req.body.author || null,
        description: req.body.description || null,
      });

      if (!parsed.success) {
        throw new BadRequestError('Invalid book metadata', parsed.error.format());
      }

      const book = await this.service.importBook(parsed.data, req.file.buffer, req.file.originalname);
      res.status(201).json({ data: book });
    } catch (err) {
      next(err);
    }
  }
}

export const booksController = new BooksController();
