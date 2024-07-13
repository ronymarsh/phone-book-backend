import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';
import {
  CreateContactDto,
  SearchContactsQueryWithPaginationDto,
  UpadteContactDto,
} from '../dtos/contact.dto';
import {
  PaginationResponseDto,
  PaginationMetadataDto,
} from '../../dtos/pagination.dto';
import { SortDirEnum } from 'src/enums/db.enums';

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
    searchContactsQueryWithPaginationDto: SearchContactsQueryWithPaginationDto,
  ): Promise<PaginationResponseDto<ContactDocument>> {
    const { page, pageSize, searchKey, sortBy, sortDirection } =
      searchContactsQueryWithPaginationDto;
    const _skip = (page - 1) * pageSize;
    const totalCount = await this.contactModel.countDocuments();

    const data: ContactDocument[] = await this.contactModel
      .find(
        searchKey
          ? {
              $text: {
                $search: searchKey,
                $caseSensitive: false,
              },
            }
          : {},
      )
      .sort(this.sortQueryToObject(sortBy, sortDirection))
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

  async deleteById(id: string): Promise<ContactDocument> {
    return this.contactModel.findByIdAndDelete(id);
  }

  async update(
    id: string,
    updateDto: UpadteContactDto,
  ): Promise<ContactDocument> {
    return this.contactModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  private sortQueryToObject(sortBy: string, sortDirection: SortDirEnum) {
    const sortObj = {};

    if (sortBy) {
      Object.assign(sortObj, {
        [`${sortBy}`]: sortDirection ? sortDirection : SortDirEnum.asc,
      });
    }

    return sortObj;
  }
}
