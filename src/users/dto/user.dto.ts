import { IsEmail, IsNotEmpty, Length, IsString, IsMongoId } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email:  string

    @IsString()
    @Length(8, 20)
    @IsNotEmpty()
    password: string;
}