import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactsModel: Model<Contact>,
  ) {}

  async create(createContactDto: any): Promise<ContactDocument> {
    return this.contactsModel.create(createContactDto);
  }
}
