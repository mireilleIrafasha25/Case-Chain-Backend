import express from 'express';
import mongoose from 'mongoose';
import router from './route/index.js';
import errorHandler from './Middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

// Dynamic import for JSON
const loadSwaggerDoc = async () => {
  const documentation = await import('./Doc/swagger.json', {
    assert: { type: 'json' },
  }).then((mod) => mod.default);
  return documentation;
};

const app = express();
app.use(cors());
app.use(express.json());

loadSwaggerDoc().then((documentation) => {
  app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(documentation));
});

app.use('/CaseChain', router);

mongoose.connect(process.env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log(err);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.use(errorHandler);
