import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';


export const errorMiddleware = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  
  console.log(error);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};