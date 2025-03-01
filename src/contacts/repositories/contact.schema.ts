import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { last } from 'rxjs';

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String })
  address: string;
}
export type ContactDocument = HydratedDocument<Contact>;

export const ContactSchema = SchemaFactory.createForClass(Contact)
  .index({
    '$**': 'text',
  })
  .index(
    {
      firstName: 1,
      lastName: 1,
    },
    { unique: true },
  );
