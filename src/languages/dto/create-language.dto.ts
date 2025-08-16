import { IsString } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  name: string;

  @IsString()
  code: string; // "en", "am"
}
