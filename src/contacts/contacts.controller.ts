import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDocument } from './repositories/contact.schema';
import { ContactDocumentDto, CreateContactDto } from './dtos/contact.dto';
import { IsMongoId } from 'class-validator';
import { MongoIdParam } from '../dtos/mongo-id-param.dto';
import { PaginationRequestDto } from '../dtos/pagination.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Contact created',
    type: ContactDocumentDto,
  })
  async createContact(
    @Body() contact: CreateContactDto,
  ): Promise<ContactDocument> {
    return this.contactsService.create(contact);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  async getContacts(@Query() paginationRequestDto: PaginationRequestDto) {
    return this.contactsService.getContacts(paginationRequestDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: MongoIdParam })
  @ApiOkResponse({
    description: 'Get specific contact by its mongo id',
    type: ContactDocumentDto,
  })
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
