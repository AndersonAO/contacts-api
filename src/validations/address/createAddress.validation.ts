
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos campos para a criação dos endereços.
 */
export const createAddressValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.PARAMS]: {
      contactId: Joi.string().uuid(),
    },
    [Segments.BODY]: {
      zipcode: Joi.string().pattern(/^[0-9]{5}-[0-9]{3}$/).required(),
      street: Joi.string().trim().required(),
      number: Joi.string().trim().required(),
      complement: Joi.string().trim().required(),
      district: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().length(2).required(),
    },
  })(req, res, next);
};