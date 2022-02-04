import prisma from '../prisma';

interface IFilters {
  name?: string;
  email?: string;
  cpf_cnpj?: string;
  phone?: string;
  showInactive?: boolean;
  expand?: boolean;
}

interface IAndOperator {
  [key: string]: string | {}
}

class ListContactService {
  public async exec(filters?: IFilters) {
    const AND = [] as IAndOperator[];

    const include = { addresses: true, _count: true } as { addresses?: boolean, _count: boolean };

    if (filters) {
      if (!filters.showInactive) {
        AND.push({ status: 'Ativo' });
      }

      if (!filters.expand) {
        delete include?.addresses;
      }

      if (filters.name) {
        AND.push({ name: { contains: filters.name, mode: 'insensitive' } });
      }

      if (filters.email) {
        AND.push({ email: { contains: filters.email, mode: 'insensitive' } });
      }

      if (filters.cpf_cnpj) {
        AND.push({ cpf_cnpj: { contains: filters.cpf_cnpj } });
      }

      if (filters.phone) {
        AND.push({ phone: { contains: filters.phone } });
      }
    }

    const contacts = await prisma.contact.findMany({
      where: {
        AND,
      },
      include,
    });

    return contacts;
  }
}


export default ListContactService;
