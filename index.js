import dotenv from 'dotenv';
import express from 'express';
import router from './src/routes/pockemon.route.js';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
    fs.readFileSync('./src/config/documentation.json', 'utf8')
);

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

dotenv.config();

const app = express()
const PORT = process.env.PORT;  
const HOST = process.env.HOST;

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, './src/config/documentation.json'), // fichier de dcumentation OpenAPI
    validateRequests: true,
    validateResponses: true
  })
);
app.use('/api/pokemons',router)

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});


app.listen(PORT, HOST, () => {
    console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
});