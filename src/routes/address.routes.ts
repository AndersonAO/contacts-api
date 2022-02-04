import express from 'express';

const router = express.Router();
import ContactAddressController from '../controllers/ContactAddressController';

import {
  createAddressValidation,
  updateAddressValidation,
  listAddressValidation,
} from '../validations';

const controller = new ContactAddressController();

router.post('/:contactId', createAddressValidation, controller.create); // Rota para cadastrar endereço.
router.put('/:id', updateAddressValidation, controller.update); // Rota para atualizar endereço.
router.get('/', listAddressValidation, controller.list); // Rota para listar endereços.

export default router;
