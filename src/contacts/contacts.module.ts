import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ContactsRepository } from './repositories/contacts.repository';
import { Contact, ContactSchema } from './repositories/contact.schema';
import { LoggerModule } from 'src/logger/src/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_PHONE_BOOK_HOST),
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    LoggerModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService, ContactsRepository],
})
export class ContactsModule {}
