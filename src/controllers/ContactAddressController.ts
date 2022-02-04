import { Request, Response } from 'express';

import CreateAddressService from '../services/address/CreateContactService';
import ListAddressService from '../services/address/ListAddressService';
import UpdateAddressService from '../services/address/UpdateAddressService';

class ContactAddressController {
  public async create(req: Request, res: Response) {
    const createService = new CreateAddressService();

    const { contactId } = req.params;

    const created = await createService.exec({ ...req.body, id_contacts: contactId });

    res.json(created);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;

    const updateService = new UpdateAddressService();

    req.body.id = id;

    const updated = await updateService.exec(req.body);

    res.status(200).json(updated);
  }

  public async list(req: Request, res: Response) {
    const filters = req.query;

    const listService = new ListAddressService();

    const addresses = await listService.exec(filters);

    res.status(200).json(addresses);
  }
}

export default ContactAddressController;
