import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MongoIdParam {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
