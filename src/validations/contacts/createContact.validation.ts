
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos campos para a criação dos contatos.
 */
export const createContactValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cpf_cnpj: Joi.string().required(),
      phone: Joi.string().allow('').optional(),
      email: Joi.string().email().required(),
    },
  })(req, res, next);
};