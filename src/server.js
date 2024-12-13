import express from 'express';
import * as fs from 'fs';
import pino from 'pino-http';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './utils/env.js';
import usersRouter from './routers/users.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '3000'));

const swaggerDocument = JSON.parse(fs.readFileSync('./docs/swagger.json', 'utf-8'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use('/users', usersRouter);
  app.use("/auth", authRouter);
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI docs available at http://localhost:${PORT}/api-docs`);
  });
};
