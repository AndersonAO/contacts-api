import prisma from '../prisma';
import { ContactsAddress } from '@prisma/client';
import AppError from '../../errors/AppError';

class UpdateAddressService {
  public async exec(data: ContactsAddress) {
    const exists = await prisma.contactsAddress.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!exists) {
      throw new AppError('ADDRESS_NOT_EXISTS');
    }
    
    const updated = await prisma.contactsAddress.update({
      where: {
        id: data.id,
      },
      data,
    });
       
    return updated;
  }
}


export default UpdateAddressService;
