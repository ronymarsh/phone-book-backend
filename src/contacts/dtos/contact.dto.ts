import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { PaginationRequestDto } from 'src/dtos/pagination.dto';
import { SortDirEnum } from 'src/enums/db.enums';

export class CreateContactDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  address: string;
}

export class UpadteContactDto extends PartialType(CreateContactDto) {}

export class SearchContactsQueryWithPaginationDto extends PaginationRequestDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  searchKey: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEnum(SortDirEnum)
  sortDirection: SortDirEnum;
}

// for swagger
export class ContactDocumentDto extends CreateContactDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsMongoId()
  createdAt: string;

  @ApiProperty()
  @IsMongoId()
  updateAt: string;

  @ApiProperty()
  @IsMongoId()
  __v: string;
}
