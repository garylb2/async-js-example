const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const setup = (root) => {

  const options = {
    swaggerDefinition: {
      openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
      info: {
        title: 'Simple Employee API', // Title (required)
        version: '1.0.0', // Version (required)
      }
    },
    // Path to the API docs
    apis: ['./server/routes.js'],
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options);

  const swaggerUiEndpoint = '/swagger-ui';
  root.use(swaggerUiEndpoint, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  root.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  root.get('/', (req,res) => {
    res.redirect(swaggerUiEndpoint);
  });

};

exports.setup = setup;
