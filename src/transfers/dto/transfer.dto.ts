import { IsEmail, IsNotEmpty, IsPositive, IsInt } from 'class-validator';

export class TransferDto {
    @IsNotEmpty()
    @IsEmail()
    to_user_email:  string

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    points: number;
}