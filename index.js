import express from 'express';
import mongoose from 'mongoose';
import router from './Route/index.js';
import errorHandler from './Middleware/errorhandler.js';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import cors from "cors";
dotenv.config();

// Dynamic JSON Import
const loadSwaggerDoc = async () => {
  const documentation = await import('./Doc/swagger.json', { assert: { type: 'json' } });
  return documentation.default;
};

loadSwaggerDoc()
  .then((documentation) => {
    app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(documentation));
  })
  .catch((err) => {
    console.error('Error loading Swagger documentation:', err);
  });


const options = {
  serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 45000, 
  maxPoolSize: 10,
};

const app = express();
app.use(cors());
app.use(express.json());

// Load Swagger Documentation dynamically
loadSwaggerDoc().then((documentation) => {
  app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(documentation));
}).catch(err => {
  console.error('Error loading Swagger documentation:', err);
});

app.use('/CaseChain', router);

// MongoDB Connection
mongoose.connect(process.env.db, options)
  .then(() => console.log('connected to db'))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

app.use(errorHandler);
