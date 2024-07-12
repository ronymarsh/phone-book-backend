import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  page = 1;

  @ApiProperty()
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

export class PaginationResponseDto {
  metadata: PaginationMetadataDto;
  data: any[];
}
