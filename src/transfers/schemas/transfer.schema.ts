import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';


export type TransferDocument = Transfer & Document;

@Schema()
export class Transfer {
    
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  from_user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  to_user: User;

  @Prop()
  points: Number;

  @Prop()
  expiration_date: Date;

  @Prop()
  confirmation_date: Date;

  @Prop({type: Boolean, default: false})
  is_confirmed: Boolean;

}

export const TransferSchema = SchemaFactory.createForClass(Transfer);