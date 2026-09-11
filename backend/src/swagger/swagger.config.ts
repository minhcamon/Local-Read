export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'LocalRead REST API',
    version: '1.0.0',
    description: 'Personal Reading System on Laptop — API Documentation',
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
        summary: 'List all books in the library',
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
        },
      },
    },
    '/documents/{id}/file': {
      get: {
        summary: 'Stream PDF document content for the reader',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'PDF stream binary' },
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
        summary: 'Save reading progress for a document',
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
        responses: {
          '201': { description: 'Highlight created' },
        },
      },
    },
  },
};
