import { IsString, MinLength } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @MinLength(4)
  firstName: string;

  @IsString()
  @MinLength(4)
  lastName: string;
}
