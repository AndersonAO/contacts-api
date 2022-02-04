
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos campos na atualização de um contato.
 */
export const updateContactValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cpf_cnpj: Joi.string().required(),
      phone: Joi.string().allow('').optional(),
      email: Joi.string().email().required(),
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  })(req, res, next);
};