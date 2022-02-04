import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos filtros para listagem de endereços.
 */
export const listAddressValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.QUERY]: {
      city: Joi.string().optional(),
      zipcode: Joi.string().optional(),
      contactId: Joi.string().uuid().optional(),
    },
  })(req, res, next);
};
