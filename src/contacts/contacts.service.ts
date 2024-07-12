import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './repositories/contacts.repository';
import { ContactDocument } from './repositories/contact.schema';
import { CreateContactDto, UpadteContactDto } from './dtos/contact.dto';
import {
  PaginationResponseDto,
  PaginationRequestDto,
} from '../dtos/pagination.dto';

@Injectable()
export class ContactsService {
  constructor(private contactsRepository: ContactsRepository) {}
  createContact(contact: CreateContactDto): Promise<ContactDocument> {
    return this.contactsRepository.create(contact);
  }

  bulkCreateContacts(contacts: CreateContactDto[]): Promise<ContactDocument[]> {
    return this.contactsRepository.bulkCreate(contacts);
  }

  getContacts(
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ContactDocument>> {
    return this.contactsRepository.findManyWithPagination(paginationRequestDto);
  }

  getContactById(id: string): Promise<ContactDocument> {
    return this.contactsRepository.findById(id);
  }

  deleteContactById(id: string): Promise<ContactDocument> {
    return this.contactsRepository.deleteById(id);
  }

  updateContact(
    contactId: string,
    upadateContactDto: UpadteContactDto,
  ): Promise<ContactDocument> {
    return this.contactsRepository.update(contactId, upadateContactDto);
  }

  searchContacts(searchPhrase: string) {
    return this.contactsRepository.search(searchPhrase);
  }
}
