import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ContactsRepository } from './repositories/contacts.repository';
import * as fs from 'fs';
import * as path from 'path';
import { MAX_CSV_LIMIT } from 'src/consts';
import { createObjectCsvWriter } from 'csv-writer';
import { Response } from 'express';
import { CreateContactDto } from './dtos/contact.dto';
const csvToJSON = require('csv-file-to-json');

@Injectable()
export class ContactsCsvService {
  constructor(private contactsRepository: ContactsRepository) {}

  async exportContacts(@Res() responseObj: Response) {
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

  async importContactsFromCsv(fileName: string) {
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

    return this.contactsRepository.bulkCreate(dataInJSON);
  }
}
