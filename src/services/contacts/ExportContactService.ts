import prisma from '../prisma';
import { Parser } from 'json2csv';

class ExportContactService {
  public async exec() {
    const contacts = await prisma.contact.findMany({
      where: {
        status: 'Ativo',
      },
      include: {
        addresses: true,
      },
    });

    const formattedContacts = contacts.map(contact => ({
      Nome: contact.name,
      Email: contact.email,
      Telefone: contact.phone,
      'CPF/CNPJ': contact.cpf_cnpj,
      Tipo: contact.type,

      CEP: contact.addresses[0]?.zipcode || '',
      Logradouro: contact.addresses[0]?.complement || '',
      Número: contact.addresses[0]?.number || '',
      Complemento: contact.addresses[0]?.complement || '',
      Bairro: contact.addresses[0]?.district || '',
      Cidade: contact.addresses[0]?.city || '',
      Estado: contact.addresses[0]?.state || '',
    }));

    const parser = new Parser({
      fields: [
        'Nome',
        'Email',
        'Telefone',
        'CPF/CNPJ',
        'Tipo',
        'CEP',
        'Logradouro',
        'Número',
        'Complemento',
        'Cidade',
        'Estado',
      ],
    });
    const csv = parser.parse(formattedContacts);

    console.log(csv);

    return csv;
  }
}

export default ExportContactService;
