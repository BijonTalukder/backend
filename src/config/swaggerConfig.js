// src/config/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce Management API',
      version: '1.0.0',
      description: 'API documentation for E-commerce Management application',
      contact: {
        name: 'Your Name',
        email: 'your.email@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',  // Route files
    './src/models/*.js',  // Optional: model schemas
    './src/controllers/*.js'  // Optional: controller annotations
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;