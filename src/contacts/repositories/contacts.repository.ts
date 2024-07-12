import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';
import { CreateContactDto } from '../dtos/create-contact.dto';
import {
  PaginationRequestDto,
  PaginationResponseDto,
  PaginationMetadataDto,
} from '../../dtos/pagination.dto';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<Contact>,
  ) {}

  async create(contact: CreateContactDto): Promise<ContactDocument> {
    return this.contactModel.create(contact);
  }

  async bulkCreate(contacts: CreateContactDto[]): Promise<ContactDocument[]> {
    return this.contactModel.insertMany(contacts);
  }

  async findById(id: string): Promise<ContactDocument> {
    return this.contactModel.findById(id);
  }

  async findManyWithPagination(
    paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto> {
    const { page, pageSize } = paginationRequestDto;
    const _skip = (page - 1) * pageSize;
    const totalCount = await this.contactModel.countDocuments();

    const data: ContactDocument[] = await this.contactModel
      .find()
      .sort({ firstName: 1 })
      .skip(_skip)
      .limit(pageSize)
      .lean();

    const metadata: PaginationMetadataDto = {
      page,
      pageSize,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
    };

    return { metadata, data };
  }
}
