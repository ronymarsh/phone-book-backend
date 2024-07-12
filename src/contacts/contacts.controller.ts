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
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactDocument } from './repositories/contact.schema';
import {
  ContactDocumentDto,
  CreateContactDto,
  UpadteContactDto,
} from './dtos/contact.dto';
import { MongoIdParam } from '../dtos/mongo-id-param.dto';
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from '../dtos/pagination.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

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
  @ApiResponse({ type: () => PaginationResponseDto })
  async getContacts(
    @Query() paginationRequestDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ContactDocument>> {
    return this.contactsService.getContacts(paginationRequestDto);
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
    description: 'Contact created',
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
    description: 'Contact deleted',
    type: ContactDocumentDto,
  })
  async deleteContactById(
    @Param() mongoIdParam: MongoIdParam,
  ): Promise<ContactDocument> {
    return this.contactsService.deleteContactById(mongoIdParam.id);
  }
}
