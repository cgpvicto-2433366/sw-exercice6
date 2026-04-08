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

// Middleware pour nettoyer les paramètres "null" et valider le type avant la validation OpenAPI
app.use((req, res, next) => {
  // Nettoyer les paramètres query
  Object.keys(req.query).forEach(key => {
    const value = req.query[key];
    
    // Supprimer si c'est "null" ou "undefined"
    if (value === 'null' || value === 'undefined' || value === '') {
      delete req.query[key];
    }
    // Pour le paramètre "page", convertir en integer ou supprimer
    else if (key === 'page') {
      const pageNum = parseInt(value);
      if (isNaN(pageNum)) {
        delete req.query[key];
      } else {
        req.query[key] = pageNum;
      }
    }
  });
  next();
});

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