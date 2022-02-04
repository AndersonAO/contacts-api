import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware para validação dos filtros para listagem de contatos.
 */
export const listContactValidation = (req: Request, res: Response, next: NextFunction) => {
  return celebrate({
    [Segments.QUERY]: {
      name: Joi.string().optional(),
      cpf_cnpj: Joi.string().optional(),
      phone: Joi.string().allow('').optional(),
      email: Joi.string().email().optional(),
      showInactive: Joi.boolean().optional(),
      expand: Joi.boolean().optional(), // Expandir todas as informações
    },
  })(req, res, next);
};
