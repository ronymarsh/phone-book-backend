import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { log } from 'console';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactsModel: Model<Contact>,
  ) {}

  async create(contact: CreateContactDto): Promise<ContactDocument> {
    return this.contactsModel.create(contact);
  }

  async bulkCreate(contacts: CreateContactDto[]): Promise<ContactDocument[]> {
    return this.contactsModel.insertMany(contacts);
  }

  async findById(id:string):Promise<ContactDocument>{
    return this.contactsModel.findById(id)
  }
}
