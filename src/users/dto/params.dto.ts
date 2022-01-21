import { IsMongoId } from 'class-validator';

export class ParamsDto {
  @IsMongoId()
  userId: string;
}
