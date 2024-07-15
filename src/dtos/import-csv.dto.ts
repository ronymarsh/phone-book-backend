import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImportCsvParamsDto {
  @IsNotEmpty()
  @ApiProperty({ required: false, type: String })
  fileName: string;
}
