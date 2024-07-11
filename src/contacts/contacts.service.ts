import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';

@Injectable()
export class ContactsService {
  constructor(
    private contactsRepo: ContactsRepository
  ){

  }
  create(createContactDto): Promise<any> {
    return this.contactsRepo.create(createContactDto)
  }
}
