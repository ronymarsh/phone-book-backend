import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactsRepository } from './repositories/contacts.repository';
import { ContactDocument } from './repositories/contact.schema';
import {
  CreateContactDto,
  SearchContactsQueryWithPaginationDto,
  UpadteContactDto,
} from './dtos/contact.dto';
import { PaginationResponseDto } from '../dtos/pagination.dto';
import { LoggerService } from 'src/logger/src/logger.service';

@Injectable()
export class ContactsService {
  constructor(
    private contactsRepository: ContactsRepository,
    private loggerService: LoggerService,
  ) {}

  async createContact(contact: CreateContactDto): Promise<ContactDocument> {
    let createdContact: ContactDocument;

    try {
      contact = await this.contactsRepository.create(contact);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT)
        this.handleDuplicateContactError(error.response);
    }

    return createdContact;
  }

  async bulkCreateContacts(
    contacts: CreateContactDto[],
  ): Promise<ContactDocument[]> {
    let createdContacts: ContactDocument[];

    try {
      createdContacts = await this.contactsRepository.bulkCreate(contacts);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        this.handleBulkDuplicateContactError(error.response);
      }
    }

    return createdContacts;
  }

  getContacts(
    searchContactsQueryWithPaginationDto: SearchContactsQueryWithPaginationDto,
  ): Promise<PaginationResponseDto<ContactDocument>> {
    return this.contactsRepository.findManyWithPagination(
      searchContactsQueryWithPaginationDto,
    );
  }

  async getContactById(id: string): Promise<ContactDocument> {
    const contact = await this.contactsRepository.findById(id);

    if (!contact) {
      this.handleContactNotFound();
    }

    return contact;
  }

  deleteContactById(id: string): Promise<ContactDocument> {
    return this.contactsRepository.deleteById(id);
  }

  async updateContact(
    contactId: string,
    upadateContactDto: UpadteContactDto,
  ): Promise<ContactDocument> {
    let updatedContact: ContactDocument;

    try {
      updatedContact = await this.contactsRepository.update(
        contactId,
        upadateContactDto,
      );
      console.log(updatedContact);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT)
        this.handleDuplicateContactError(error.response);
    }

    if (!updatedContact) {
      this.handleContactNotFound();
    }

    return updatedContact;
  }

  private handleContactNotFound() {
    const errorMsg = `Contact with porvided ID not found`;
    this.loggerService.error(errorMsg);
    throw new NotFoundException('Contact with porvided ID not found');
  }

  private handleDuplicateContactError(keys: Iterable<string>[]) {
    const errorMsg = `Contact with provided keys already exists: ${keys}`;
    this.loggerService.error(errorMsg);
    throw new ConflictException(errorMsg);
  }

  private handleBulkDuplicateContactError(message: string) {
    const errorMsg = `Contact with provided keys already exists: ${message}`;
    this.loggerService.error(errorMsg);
    throw new ConflictException(errorMsg);
  }
}
