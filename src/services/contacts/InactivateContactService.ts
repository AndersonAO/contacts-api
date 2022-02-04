import prisma from '../prisma';
import AppError from '../../errors/AppError';

class InactivateContactService {
  public async exec(id: string) {
    const exists = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!exists) {
      throw new AppError('CONTACT_NOT_FOUND', 400);
    }

    if (exists.status === 'Inativo') {
      throw new AppError('CONTACT_ALREADY_INACTIVE', 400);
    }

    const updated = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        status: 'Inativo', 
      },
    });
       
    return updated;
  }
}


export default InactivateContactService;
