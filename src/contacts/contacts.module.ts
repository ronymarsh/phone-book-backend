import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ContactsRepository } from './contacts.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_PHONE_BOOK_HOST),
    MongooseModule.forFeature([{name:"Contacts",schema:{}}])

  ],
  controllers: [ContactsController],
  providers: [ContactsService,ContactsRepository],
})
export class ContactsModule {}
