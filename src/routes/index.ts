import express from 'express';

const router = express.Router();
import contactRoutes from './contact.routes';
import addressRoutes from './address.routes';

router.use('/contacts', contactRoutes);
router.use('/address', addressRoutes);

export default router;