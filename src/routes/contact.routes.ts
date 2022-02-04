import express from 'express';
import { listContactValidation } from '~/validations/contacts/listContact.validation';

import ContactController from '../controllers/ContactController';

import { upload } from '../middlewares/upload';

import {
  createContactValidation,
  updateContactValidation,
  activateContactValidation,
} from '../validations';

const router = express.Router();

const controller = new ContactController();

router.post('/', createContactValidation, controller.create); // Rota para cadastrar contato.
router.post('/import', upload, controller.import); // Rota para importar contatos.
router.put('/:id', updateContactValidation, controller.update); // Rota para atualizar contato.
router.put('/:id/activate', activateContactValidation, controller.activate); // Rota para ativar contato.
router.delete('/:id', activateContactValidation, controller.inactivate); // Rota para ativar contato.
router.get('/', listContactValidation, controller.list); // Rota para listar contatos.
router.get('/export', controller.export); // Rota para detalhar contato.
router.get('/:id', activateContactValidation, controller.find); // Rota para detalhar contato.

export default router;
