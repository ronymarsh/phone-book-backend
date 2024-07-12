import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './repositories/contacts.repository';
import { ContactDocument } from './repositories/contact.schema';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}
  create(createContactDto): Promise<ContactDocument> {
    return this.contactsRepository.create(createContactDto);
  }
}
