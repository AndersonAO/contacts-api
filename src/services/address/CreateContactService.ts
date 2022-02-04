import prisma from '../prisma';
import { ContactsAddress } from '@prisma/client';
import AppError from '../../errors/AppError';

class CreateAddressService {
  public async exec(data: ContactsAddress) {
    const contactExists = await prisma.contact.findUnique({
      where: { id: data.id_contacts },
    });

    if ( !contactExists ) {
      throw new AppError('CONTACT_NOT_EXISTS', 400);
    }

    const created = await prisma.contactsAddress.create({
      data,
    });

    return created;
  }
}

export default CreateAddressService;
