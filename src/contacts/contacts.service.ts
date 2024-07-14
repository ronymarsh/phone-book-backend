import {
  BadRequestException,
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
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
import * as fs from 'fs';
import * as path from 'path';
import { MAX_CSV_LIMIT } from 'src/consts';
import { createObjectCsvWriter } from 'csv-writer';
import { Response } from 'express';
const csvToJSON = require('csv-file-to-json');

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

  async batchCreateContacts(
    contacts: CreateContactDto[],
  ): Promise<ContactDocument[]> {
    let createdContacts: ContactDocument[];

    try {
      createdContacts = await this.contactsRepository.batchCreate(contacts);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        this.handleBatchDuplicateContactError(error.response);
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

  async exportContactsToCsv(@Res() responseObj: Response) {
    const destinationFilePath = `${process.env.CSV_DIRECTORY}/contacts.csv`;
    const contacts = await this.contactsRepository.findAll(MAX_CSV_LIMIT);

    if (!fs.existsSync(path.dirname(destinationFilePath)))
      fs.mkdirSync(path.dirname(destinationFilePath));

    const writer = createObjectCsvWriter({
      path: destinationFilePath,
      header: ['firstName', 'lastName', 'phone', 'address'],
    });
    await writer.writeRecords(contacts);

    return responseObj.download(destinationFilePath, 'contacts.csv', (err) => {
      if (err) {
        console.error(err);
      }
      fs.unlinkSync(destinationFilePath);
    });
  }

  async importContactsFromCsv(fileName: string): Promise<ContactDocument[]> {
    const filePath = `${process.env.CSV_DIRECTORY}/${fileName}.csv`;
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Input csv file not found');
    }

    const dataInJSON = csvToJSON({
      filePath,
    });

    dataInJSON.forEach((element: CreateContactDto) => {
      const { firstName, lastName, phone, address } = element;
      if (!(firstName && lastName && phone && address))
        throw new BadRequestException(
          `missing properties for contact:${JSON.stringify(element)} `,
        );
    });

    let createdContacts: ContactDocument[];
    try {
      createdContacts = await this.contactsRepository.batchCreate(dataInJSON);
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        this.handleBatchDuplicateContactError(error.response);
      }
    }
    return createdContacts;
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

  private handleBatchDuplicateContactError(message: string) {
    const errorMsg = `Contact with provided keys already exists: ${message}`;
    this.loggerService.error(errorMsg);
    throw new ConflictException(errorMsg);
  }
}
