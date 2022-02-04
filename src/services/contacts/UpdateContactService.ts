import prisma from '../prisma';
import { Contact } from '@prisma/client';
import AppError from '../../errors/AppError';
import { isValidCNPJ, isValidCPF } from '../../helpers/string';

class UpdateContactService {
  public async exec(data: Contact) {

    const exists = await prisma.contact.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!exists) {
      throw new AppError('CONTACT_NOT_EXISTS');
    }

    if (data.cpf_cnpj.length !== 11 && data.cpf_cnpj.length !== 14) {
      throw new AppError('PROVIDED_CPF_CNPJ_IS_INVALID');
    }

    const isCPF = data.cpf_cnpj.length === 11;

    if (isCPF) {
      data.type = 'PF';

      const isValid = isValidCPF(data.cpf_cnpj);

      if (!isValid) {
        throw new AppError('PROVIDED_CPF_IS_INVALID', 400);
      }
    } else {
      const isValid = isValidCNPJ(data.cpf_cnpj);

      if (!isValid) {
        throw new AppError('PROVIDED_CNPJ_IS_INVALID', 400);
      }
    }

    if (data.status) {
      throw new AppError('UPDATE_STATUS_IS_NOT_SUPPORTED', 400);
    }


    const alreadyExists = await prisma.contact.findFirst({
      where: {
        OR: [
          { email: data.email },
          { name: data.name },
          { cpf_cnpj: data.cpf_cnpj },
        ],
        NOT: {
          id: data.id,
        },
      },
    });
    
    if (alreadyExists) {
      const fieldRepeated = ['name', 'email', 'cpf_cnpj'].find(field => data[field] === alreadyExists[field]);
    
      throw new AppError(`[${fieldRepeated}] ALREADY_TAKEN.`);
    }
    
    const updated = await prisma.contact.update({
      where: {
        id: data.id,
      },
      data,
    });
       
    return updated;
  }
}


export default UpdateContactService;
