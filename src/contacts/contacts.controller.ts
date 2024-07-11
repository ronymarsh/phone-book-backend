import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller("/api/contacts")
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  createContact(@Body() createContactDto): Promise<any> {
    return this.contactsService.create(createContactDto);
  }
}
