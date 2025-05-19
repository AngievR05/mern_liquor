const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Creative Authentication API',
      version: '1.0.0',
      description: 'API documentation for the Creative Authentication System built with the MERN stack',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // adjust if your route/model paths differ
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
