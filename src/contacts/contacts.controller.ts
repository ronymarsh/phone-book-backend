import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDocument } from './repositories/contact.schema';
import {
  ContactDocumentDto,
  CreateContactDto,
  SearchContactsQueryWithPaginationDto,
  UpadteContactDto,
} from './dtos/contact.dto';
import { MongoIdParam } from '../dtos/mongo-id-param.dto';
import { PaginationResponseDto } from '../dtos/pagination.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactsCsvService } from './contacts-csv.service';
import { Response } from 'express';
import * as fs from 'fs';
import { LoggerService } from 'src/logger/src/logger.service';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly contactsCsvService: ContactsCsvService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Desired page number',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: 'Number of contacts per page',
    required: false,
  })
  @ApiQuery({
    name: 'searchKey',
    type: String,
    description: 'Text value search',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    description: 'Field to sort by, ignored if no such field',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    type: String,
    description: 'Order to sort results by, defaults to ascending',
    required: false,
  })
  @ApiOkResponse({
    description: 'Desired contacts according to provided query',
    type: () => PaginationResponseDto<ContactDocumentDto>,
  })
  async getContacts(
    @Query()
    searchContactsQueryWithPaginationDto: SearchContactsQueryWithPaginationDto,
  ): Promise<PaginationResponseDto<ContactDocument>> {
    return this.contactsService.getContacts(
      searchContactsQueryWithPaginationDto,
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: MongoIdParam })
  @ApiOkResponse({
    description: 'Desired contact by provided ID',
    type: ContactDocumentDto,
  })
  async getContactById(
    @Param() mongoIdParam: MongoIdParam,
  ): Promise<ContactDocument> {
    return this.contactsService.getContactById(mongoIdParam.id);
  }

  @Post()
  @ApiBody({ type: () => CreateContactDto })
  @ApiCreatedResponse({
    description: 'Contact created successfully',
    type: ContactDocumentDto,
  })
  async createContact(
    @Body() contact: CreateContactDto,
  ): Promise<ContactDocument> {
    return this.contactsService.createContact(contact);
  }

  @Post('bulk')
  @ApiBody({ type: [CreateContactDto] })
  @ApiCreatedResponse({
    description: 'All contacts created successfully',
    type: [ContactDocumentDto],
  })
  async bulkCreateContacts(
    @Body(new ParseArrayPipe({ items: CreateContactDto }))
    contacts: CreateContactDto[],
  ): Promise<ContactDocument[]> {
    return this.contactsService.bulkCreateContacts(contacts);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: MongoIdParam })
  @ApiBody({ type: () => UpadteContactDto })
  @ApiResponse({
    description: 'Contact updated, returns the updated contact',
    type: ContactDocumentDto,
  })
  async upadteContact(
    @Param() mongoIdParam: MongoIdParam,
    @Body() updateDto: UpadteContactDto,
  ): Promise<ContactDocument> {
    return this.contactsService.updateContact(mongoIdParam.id, updateDto);
  }
  @Delete(':id')
  @ApiParam({ name: 'id', type: MongoIdParam })
  @ApiOkResponse({
    description: 'Contact deleted successfully',
    type: ContactDocumentDto,
  })
  async deleteContactById(
    @Param() mongoIdParam: MongoIdParam,
  ): Promise<ContactDocument> {
    return this.contactsService.deleteContactById(mongoIdParam.id);
  }

  @Get('csv/export')
  async exportContactsToCsv(@Res() responseObj: Response) {
    return this.contactsCsvService.exportContactsToCsv(responseObj);
  }

  // csv file must include headers line
  @Get('csv/import')
  async importContactsFromCsv(@Query('fileName') fileName: string) {
    return this.contactsCsvService.importContactsFromCsv(fileName);
  }
}
