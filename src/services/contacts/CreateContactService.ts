import prisma from '../prisma';
import { Contact } from '@prisma/client';
import AppError from '../../errors/AppError';
import { isValidCNPJ, isValidCPF } from '~/helpers/string';

class CreateContactService {
  public async exec(data: Contact) {

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


    const alreadyExists = await prisma.contact.findFirst({
      where: {
        OR: [
          { email: data.email },
          { name: data.name },
          { cpf_cnpj: data.cpf_cnpj },
        ],
      },
    });
    
    if (alreadyExists) {
      const fieldRepeated = ['name', 'email', 'cpf_cnpj'].find(field => data[field] === alreadyExists[field]);
    
      throw new AppError(`[${fieldRepeated}] ALREADY_TAKEN.`);
    }
    
    const created = await prisma.contact.create({
      data: {
        ...data,
        status: 'Ativo',
      },
    });
       
    return created;
  }
}


export default CreateContactService;
