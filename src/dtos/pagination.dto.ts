import { MongooseModule } from '@nestjs/mongoose';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, ValidateNested } from 'class-validator';
import { Mongoose } from 'mongoose';

export class PaginationRequestDto {
  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsNumber()
  page = 1;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @Type(() => Number)
  @Max(10)
  pageSize = 10;
}

export class PaginationMetadataDto {
  @ApiResponseProperty()
  page: number;

  @ApiResponseProperty()
  pageSize: number;

  @ApiResponseProperty()
  pageCount: number;

  @ApiResponseProperty()
  totalCount: number;
}

export class PaginationResponseDto<T> {
  @ApiResponseProperty({ type: PaginationMetadataDto })
  metadata: PaginationMetadataDto;

  @ApiResponseProperty()
  data: T[];
}
