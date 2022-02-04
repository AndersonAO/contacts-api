
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos campos para a criação dos endereços.
 */
export const updateAddressValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      zipcode: Joi.string().pattern(/^[0-9]{5}-[0-9]{3}$/).optional(),
      street: Joi.string().trim().optional(),
      number: Joi.string().trim().optional(),
      complement: Joi.string().trim().optional(),
      district: Joi.string().trim().optional(),
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().length(2).optional(),
    },
  })(req, res, next);
};