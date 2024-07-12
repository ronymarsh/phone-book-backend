import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDocument } from './repositories/contact.schema';
import { CreateContactDto } from './dtos/create-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async createContact(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactDocument> {
    return this.contactsService.create(createContactDto);
  }
}
