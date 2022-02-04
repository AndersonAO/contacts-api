import { Contact, ContactsAddress } from '@prisma/client';
import prisma from '../prisma';
import { isValidCNPJ, isValidCPF } from '~/helpers/string';
import csv from 'csvtojson';

import { v4 } from 'uuid';

interface ICSVFormat {
  Nome: string
  Email: string
  Telefone: string
  'CPF/CNPJ': string
  CEP: string
  Logradouro: string
  Número: string
  Bairro: string
  Cidade: string
  Estado: string
  Complemento: string
}

interface IError {
  line: number;
  message: string;
}

enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

enum Type {
  PF = 'PF',
  PJ = 'PJ',
}

const CEP_PATTERN = /^[0-9]{5}-[0-9]{3}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const requiredFields = ['name', 'email', 'cpf_cnpj', 'zipcode', 'street', 'number', 'district', 'city', 'state'];

class ImportContactsService {
  public async exec(file: Express.Multer.File) {
    const string = file.buffer.toString();
    const importedContacts = (await csv({}, { autoDestroy: true }).fromString(string)) as ICSVFormat[];

    const errors: IError[] = [];
    let countSuccess = 0;

    const mappedContacts = importedContacts.map(contact => ({
      name: contact.Nome,
      email: contact.Email,
      phone: contact.Telefone,
      cpf_cnpj: contact['CPF/CNPJ'],
      street: contact.Logradouro,
      number: contact.Número,
      district: contact.Bairro,
      city: contact.Cidade,
      state: contact.Estado,
      complement: contact.Complemento,
      zipcode: contact.CEP,
    }));

    let i = 2;
    for (let data of mappedContacts) {
      let countErrors = 0;
      let type: Type;

      /**
       * VALIDAÇÕES
       */
      for (const requiredField of requiredFields) { // Valida todos os campos requeridos
        if (!data[requiredField]) {
          countErrors++;
          errors.push({ line: i, message: `[${requiredField}] IS_REQUIRED.` });
        }
      } 

      if (data.cpf_cnpj.length !== 11 && data.cpf_cnpj.length !== 14) {
        errors.push({ 
          line: i,
          message: `[${data.cpf_cnpj}] PROVIDED_CPF_CNPJ_IS_INVALID.` });
        countErrors++;
      }

      const isCPF = data.cpf_cnpj.length === 11;

      if (isCPF) {
        type = Type.PF;

        const isValid = isValidCPF(data.cpf_cnpj);

        if (!isValid) {
          errors.push({ 
            line: i,
            message: `[CPF = ${data.cpf_cnpj}] PROVIDED_CPF_IS_INVALID` });
          countErrors++;
        }
      } else {
        type = Type.PJ;
        const isValid = isValidCNPJ(data.cpf_cnpj);

        if (!isValid) {
          errors.push({ 
            line: i,
            message: `[CNPJ = ${data.cpf_cnpj}] PROVIDED_CNPJ_IS_INVALID` });
          countErrors++;
        }
      }

      if (data.email && !EMAIL_PATTERN.test(data.email)) {
        errors.push({ line: i, message: `[email = ${data.email} IS_INVALID.` });
      }

      const alreadyExists = await prisma.contact.findFirst({
        where: {
          OR: [{ email: data.email }, { name: data.name }, { cpf_cnpj: data.cpf_cnpj }],
        },
      });

      if (alreadyExists) {
        const fieldRepeated = ['name', 'email', 'cpf_cnpj'].find(
          field => data[field] === alreadyExists[field],
        ) || '';

        errors.push({
          line: i,
          message: `[${fieldRepeated} = ${alreadyExists[fieldRepeated]}] ALREADY_EXISTS.`,
        });
        countErrors++;
      }

      if (data.zipcode && !CEP_PATTERN.test(data.zipcode)) {
        errors.push({ line: i, message: `[zipcode = ${data.zipcode}] IS_INVALID.`  });
        countErrors++;
      }

      if (data.state && data.state?.length !== 2 ) {
        errors.push({ line: i, message: `[state = ${data.state}] IS_INVALID.`  });
      }

      const contact: Contact = {
        id: v4(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf_cnpj: data.cpf_cnpj,
        type,
        status: Status.Ativo,
        dt_created_at: new Date(),
        dt_updated_at: new Date(),
      };

      const address: ContactsAddress = {
        id: v4(),
        id_contacts: contact.id,
        city: data.city,
        complement: data.complement,
        district: data.district,
        number: data.number,
        state: data.state,
        street: data.street,
        zipcode: data.zipcode,
      };

      i++;
      if (countErrors) {
        continue;
      }

      /**
       * Transação no banco de dados
       * Caso um falhe, as 2 operações irão ser invalidadas.
       */
      try {
        await prisma.$transaction([
          prisma.contact.create({
            data: contact,
          }),
          
          prisma.contactsAddress.create({
            data: address,
          }),
        ]);
        countSuccess++;
      } catch {
        errors.push({ line: i - 1, message: 'WE_CANT_IMPORT_THIS_LINE.' });
      }
    }
   
    return {
      created: countSuccess,
      errors,
    };
  }
}

export default ImportContactsService;
