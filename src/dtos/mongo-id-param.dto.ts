import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MongoIdParam {
  @IsMongoId()
  @ApiProperty()
  id: string;
}
