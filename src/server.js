import express from 'express';
import * as fs from 'fs';
// import pino from 'pino-http';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routers/index.js';
import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';

import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '3000'));

const swaggerDocument = JSON.parse(fs.readFileSync('./docs/swagger.json', 'utf-8'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: ['https://water-tracker-front.vercel.app', 'http://localhost:5173'],
      credentials: true, // Разрешаем куки
    }),
  );
  app.use(cookieParser());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/', router);

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'InternalServerError';
    res.status(status).json({
      status,
      message,
      data: {
        message: err.message || 'Something went wrong',
        code: err.code || null,
      },
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI docs available at http://localhost:${PORT}/api-docs`);
  });
};
