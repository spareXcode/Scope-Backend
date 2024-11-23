// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors=require('cors')
const routes=require('./routes/index')
const dotenv = require('dotenv');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// Initialize the app
const app = express();
app.use(express.json())
app.use(cors());

const swaggerDefinition = {
  openapi: '3.0.0', // Swagger 3.0 specification
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'This is the API documentation for My API',
  },
  servers: [
    {
      url: 'http://localhost:8093',
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition, 
  apis: ['./index/*.js'] // Path to the API routes
}

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const port = parseInt(process.env.PORT,10);
// console.log("port ",typeof port)


app.use('/api', routes);


app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
