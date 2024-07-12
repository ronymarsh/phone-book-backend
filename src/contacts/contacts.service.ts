import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './repositories/contacts.repository';
import { ContactDocument } from './repositories/contact.schema';
import { CreateContactDto } from './dtos/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}
  create(contact: CreateContactDto): Promise<ContactDocument> {
    return this.contactsRepository.create(contact);
  }

  bulkCreate(contacts: CreateContactDto[]): Promise<ContactDocument[]> {
    return this.contactsRepository.bulkCreate(contacts);
  }
}
