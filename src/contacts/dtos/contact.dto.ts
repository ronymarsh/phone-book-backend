import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

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

// for swagger
export class ContactDocumentDto extends CreateContactDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;
}
