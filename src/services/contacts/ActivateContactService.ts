import prisma from '../prisma';
import AppError from '../../errors/AppError';

class ActivateContactService {
  public async exec(id: string) {
    const exists = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!exists) {
      throw new AppError('CONTACT_NOT_FOUND', 400);
    }

    if (exists.status === 'Ativo') {
      throw new AppError('CONTACT_ALREADY_ACTIVE', 400);
    }

    const updated = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        status: 'Ativo', 
      },
    });
       
    return updated;
  }
}


export default ActivateContactService;
