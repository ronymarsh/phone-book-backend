import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDocument } from './repositories/contact.schema';
import { CreateContactDto } from './dtos/create-contact.dto';
import { IsMongoId } from 'class-validator';
import { MongoIdParam } from './dtos/mongo-id-param.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async createContact(
    @Body() contact: CreateContactDto,
  ): Promise<ContactDocument> {
    return this.contactsService.create(contact);
  }

  @Get()
  async getContacts() {}

  @Get(':id')
  async getContactById(@Param() mongoIdParam: MongoIdParam) {
    return this.contactsService.getContactById(mongoIdParam.id);
  }

  @Post('bulk')
  async bulkCreateContacts(
    @Body(new ParseArrayPipe({ items: CreateContactDto }))
    contacts: CreateContactDto[],
  ): Promise<any> {
    return this.contactsService.bulkCreate(contacts);
  }
}
