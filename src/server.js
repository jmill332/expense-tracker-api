require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Swagger Configuration ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'A personal finance management API for tracking transactions, categories, and budgets.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Transaction: {
          type: 'object',
          required: ['amount', 'description', 'category_id', 'type'],
          properties: {
            id: { type: 'integer', example: 1 },
            amount: { type: 'number', example: 50.00 },
            description: { type: 'string', example: 'Grocery shopping' },
            category_id: { type: 'integer', example: 2 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' },
            user_id: { type: 'integer', example: 1 }
          }
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Food & Dining' },
            user_id: { type: 'integer', example: 1 }
          }
        },
        Budget: {
          type: 'object',
          required: ['limit_amount', 'month', 'category_id'],
          properties: {
            id: { type: 'integer', example: 1 },
            limit_amount: { type: 'number', example: 500.00 },
            month: { type: 'string', example: '2026-05' },
            category_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 }
          }
        },
        AuthRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // --- Auth ---
      '/api/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRequest' } } } },
          responses: { 201: { description: 'User created' }, 409: { description: 'Email already exists' } }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login to get JWT token',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRequest' } } } },
          responses: { 200: { description: 'Success' } }
        }
      },
      // --- Transactions ---
      '/api/transactions': {
        get: { tags: ['Transactions'], summary: 'Get all transactions', responses: { 200: { description: 'Success' } } },
        post: {
          tags: ['Transactions'],
          summary: 'Create a transaction',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/api/transactions/{id}': {
        get: { tags: ['Transactions'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' }, 403: { description: 'Forbidden' }, 404: { description: 'Not Found' } } },
        put: { tags: ['Transactions'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Transactions'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } }
      },
      // --- Categories ---
      '/api/categories': {
        get: { tags: ['Categories'], summary: 'Get all categories', responses: { 200: { description: 'Success' } } },
        post: {
          tags: ['Categories'],
          summary: 'Create a category',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/api/categories/{id}': {
        get: { tags: ['Categories'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' }, 403: { description: 'Forbidden' }, 404: { description: 'Not Found' } } },
        put: { tags: ['Categories'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Categories'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } }
      },
      // --- Budgets ---
      '/api/budgets': {
        get: { tags: ['Budgets'], summary: 'Get all budgets', responses: { 200: { description: 'Success' } } },
        post: {
          tags: ['Budgets'],
          summary: 'Create a budget',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Budget' } } } },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/api/budgets/{id}': {
        get: { tags: ['Budgets'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' }, 403: { description: 'Forbidden' }, 404: { description: 'Not Found' } } },
        put: { tags: ['Budgets'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Budget' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Budgets'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } }
      }
    }
  },
  apis: [], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(express.json());

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running! Visit /api-docs for documentation.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});