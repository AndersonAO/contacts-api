import prisma from '../prisma';
import AppError from '../../errors/AppError';

class FindContactService {
  public async exec(id: string) {
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        status: 'Ativo',
      },
      include: {
        addresses: true,
      },
    });

    if (!contact) {
      throw new AppError('CONTACT_NOT_EXISTS_OR_IS_INACTIVE');
    }

    return contact;
  }
}


export default FindContactService;
