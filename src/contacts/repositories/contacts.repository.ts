import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';
import {
  ContactDocumentDto,
  CreateContactDto,
  SearchContactsQueryWithPaginationDto,
  UpadteContactDto,
} from '../dtos/contact.dto';
import {
  PaginationResponseDto,
  PaginationMetadataDto,
} from '../../dtos/pagination.dto';
import { SortDirEnum } from 'src/enums/db.enums';
import { MONGO_DUPLICATE_ERROR_CODE } from 'src/consts';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<Contact>,
  ) {}

  async create(contact: CreateContactDto): Promise<ContactDocument> {
    let createdContact: ContactDocument;
    try {
      createdContact = await this.contactModel.create(contact);
    } catch (error) {
      if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        throw new HttpException(
          Object.keys(error.keyPattern),
          HttpStatus.CONFLICT,
        );
      }
    }
    return createdContact;
  }

  async batchCreate(contacts: CreateContactDto[]): Promise<ContactDocument[]> {
    let createdContacts: ContactDocument[];
    try {
      createdContacts = await this.contactModel.insertMany(contacts);
    } catch (error) {
      if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        console.log(error);

        throw new HttpException(
          error.errorResponse.message.split('dup key:')[1],
          HttpStatus.CONFLICT,
        );
      }
    }
    return createdContacts;
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
    let updatedContact: ContactDocument;
    try {
      updatedContact = await this.contactModel.findByIdAndUpdate(
        id,
        updateDto,
        {
          new: true,
        },
      );
    } catch (error) {
      if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        throw new HttpException(
          Object.keys(error.keyPattern),
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
    return updatedContact;
  }

  async findAll(limit?: number): Promise<ContactDocument[]> {
    return this.contactModel.find().limit(limit).lean();
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
