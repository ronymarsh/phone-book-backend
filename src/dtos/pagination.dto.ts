import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, ValidateNested } from 'class-validator';

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
  @ApiResponseProperty()
  @ValidateNested()
  @Type(() => PaginationMetadataDto)
  metadata: PaginationMetadataDto;

  @ApiResponseProperty()
  data: T[];
}
