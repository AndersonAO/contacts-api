import prisma from '../prisma';

interface IFilters {
  contactId?: string;
  zipcode?: string;
  city?: string;
}

interface IAndOperator {
  [key: string]: string | {}
}

class ListAddressService {
  public async exec(filters?: IFilters) {
    const AND = [] as IAndOperator[];

    if (filters) {
      if (filters.contactId) {
        AND.push({ id_contacts: filters.contactId });
      }

      if (filters.city) {
        AND.push({ city: { contains: filters.city, mode: 'insensitive' } });
      }

      if (filters.zipcode) {
        AND.push({ zipcode: { contains: filters.zipcode, mode: 'insensitive' } });
      }
    }

    const contacts = await prisma.contactsAddress.findMany({
      where: {
        AND,
      },
    });

    return contacts;
  }
}


export default ListAddressService;
