import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
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

export class PaginationResponseDto {
  metadata: PaginationMetadataDto;
  data: any[];
}
