import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import routes from './app/routes';

import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

// const corsOptions = {
//   // origin: true,
//   origin: 'https://cellsavers-frontend-khshakilahamed.vercel.app/',
//   credentials: true,
// };
// app.use('*', cors(corsOptions));
app.use(
  cors({
    // origin: true,
    origin: 'https://cellsavers-frontend-khshakilahamed.vercel.app',
    credentials: true,
  }),
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome HTTP SERVER',
  });
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessage: {
      path: req.originalUrl,
      message: 'Not Found',
    },
  });
});

export default app;
