import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/Types/users.types';

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = Document & User & UserMethods;

@Schema({ timestamps: true })
export class User {
  _id: unknown;

  @IsNotEmpty()
  @Prop({ required: true })
  firstName: string;

  @IsNotEmpty()
  @Prop({ required: true })
  lastName: string;

  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @IsNotEmpty()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  userType: UserType;
}

const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Apply the mongoose paginate plugin
UserSchema.plugin(mongoosePaginate);

export { UserSchema };
