import { Request, Response } from 'express';

import CreateContactService from '../services/contacts/CreateContactService';
import UpdateContactService from '../services/contacts/UpdateContactService';
import ActivateContactService from '../services/contacts/ActivateContactService';
import InactivateContactService from '../services/contacts/InactivateContactService';
import ListContactService from '../services/contacts/ListContactService';
import FindContactService from '../services/contacts/FindContactService';
import ImportContactsService from '~/services/contacts/ImportContactsService';
import ExportContactService from '../services/contacts/ExportContactService';

class ContactController {
  public async create(req: Request, res: Response) {
    const createService = new CreateContactService();

    const created = await createService.exec(req.body);

    res.json(created);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;

    const updateService = new UpdateContactService();

    req.body.id = id;

    const updated = await updateService.exec(req.body);

    res.status(200).json(updated);
  }

  public async activate(req: Request, res: Response) {
    const { id } = req.params;

    const activateService = new ActivateContactService();

    const activated = await activateService.exec(id);

    res.status(200).json(activated);
  }

  public async inactivate(req: Request, res: Response) {
    const { id } = req.params;

    const inactivateService = new InactivateContactService();

    const inactivated = await inactivateService.exec(id);

    res.status(200).json(inactivated);
  }

  public async list(req: Request, res: Response) {
    const filters = req.query;

    const listService = new ListContactService();

    const contacts = await listService.exec({
      ...filters,
      showInactive: Boolean(filters.showInactive),
      expand: Boolean(filters.expand),
    });

    res.status(200).json(contacts);
  }

  public async find(req: Request, res: Response) {
    const { id } = req.params;

    const findService = new FindContactService();

    const contact = await findService.exec(id);

    res.status(200).json(contact);
  }

  public async export(req: Request, res: Response) {
    const exportService = new ExportContactService();

    const csv = await exportService.exec();

    res.status(200).attachment('contacts.csv').send(csv);
  }

  public async import(req: Request, res: Response) {
    const { file } = req;

    const importContacts = new ImportContactsService();

    if (!file) {
      return res.status(400).json({ message: 'UPLOAD_FAILED.' });
    }

    const results = await importContacts.exec(file);

    res.status(200).json(results);
  }
}

export default ContactController;
