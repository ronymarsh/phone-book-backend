import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ContactsRepository {
constructor(
    @InjectModel("Contacts") private contactsModel: Model<any>
){}

async create(createContactDto:any): Promise<any>{
    return this.contactsModel.create(createContactDto)
}
async findById(){

}
}
