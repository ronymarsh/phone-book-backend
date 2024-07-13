import { CreateContactDto } from './dtos/contact.dto';

export const csvToCreateContactDto = (
  contactsFromCsv: string[][],
): CreateContactDto[] => {
  return contactsFromCsv.map((row) => {
    return {
      firstName: row[0],
      lastName: row[1],
      phone: row[3],
      address: row[4],
    };
  });
};
