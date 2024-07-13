import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MongoIdParam {
  @ApiProperty({ required: true, type: String })
  @ApiProperty()
  @IsMongoId()
  id: string;
}
