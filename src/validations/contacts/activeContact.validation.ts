
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos campos na atualização de um contato.
 */
export const activateContactValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid(),
    },
  })(req, res, next);
};