export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'LocalRead REST API',
    version: '1.0.0',
    description: 'Personal Reading System on Laptop — API Documentation for MVP v1',
  },
  servers: [
    {
      url: '/api',
      description: 'LocalRead API Server',
    },
  ],
  paths: {
    '/books': {
      get: {
        summary: 'List all books in the library with reading status & progress',
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['all', 'reading', 'finished', 'saved'], default: 'all' },
            description: 'Filter books by category / reading state',
          },
          {
            name: 'q',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Search keyword across book title or author',
          },
        ],
        responses: {
          '200': { description: 'List of books retrieved successfully' },
        },
      },
    },
    '/books/import': {
      post: {
        summary: 'Import a local PDF file into the library',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                  title: { type: 'string' },
                  author: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Book and document created' },
          '400': { description: 'Invalid file format or missing PDF' },
        },
      },
    },
    '/books/{id}': {
      get: {
        summary: 'Get detailed book information and associated documents',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Book details retrieved' },
          '404': { description: 'Book not found' },
        },
      },
      delete: {
        summary: 'Delete a book, its database records, and physical files',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Book deleted successfully' },
          '404': { description: 'Book not found' },
        },
      },
    },
    '/documents/{id}/file': {
      get: {
        summary: 'Stream PDF document content for the reader (Supports HTTP 206 Partial Content)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'Range', in: 'header', required: false, schema: { type: 'string' }, example: 'bytes=0-1048576' },
        ],
        responses: {
          '200': { description: 'Complete PDF stream binary' },
          '206': { description: 'Partial Content byte range binary' },
          '416': { description: 'Range Not Satisfiable' },
        },
      },
    },
    '/progress/{documentId}': {
      get: {
        summary: 'Get reading progress for a document',
        parameters: [
          { name: 'documentId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Reading progress object' },
        },
      },
      put: {
        summary: 'Save reading progress for a document (Atomic Upsert)',
        parameters: [
          { name: 'documentId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  location: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', example: 'pdf_page' },
                      value: {
                        type: 'object',
                        properties: {
                          pageNumber: { type: 'integer', example: 42 },
                          totalPages: { type: 'integer', example: 350 },
                        },
                      },
                    },
                    required: ['type', 'value'],
                  },
                  percentage: { type: 'number', example: 12 },
                },
                required: ['location'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Reading progress saved' },
        },
      },
    },
    '/highlights/{documentId}': {
      get: {
        summary: 'List highlights for a document',
        parameters: [
          { name: 'documentId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of highlights' },
        },
      },
      post: {
        summary: 'Create a new highlight',
        parameters: [
          { name: 'documentId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  location: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', example: 'pdf_page' },
                      value: {
                        type: 'object',
                        properties: {
                          pageNumber: { type: 'integer', example: 15 },
                          rects: { type: 'array', items: { type: 'object' } },
                        },
                      },
                    },
                    required: ['type', 'value'],
                  },
                  color: { type: 'string', example: '#FACC15' },
                  textContent: { type: 'string', example: 'Highlighted text quote...' },
                  note: { type: 'string', nullable: true },
                },
                required: ['location', 'textContent'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Highlight created' },
        },
      },
    },
    '/highlights/{documentId}/{highlightId}': {
      delete: {
        summary: 'Delete a highlight by ID',
        parameters: [
          { name: 'documentId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'highlightId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '204': { description: 'Highlight deleted successfully' },
          '404': { description: 'Highlight not found' },
        },
      },
    },
  },
};
