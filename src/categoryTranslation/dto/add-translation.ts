import { IsInt, IsString } from 'class-validator';

export class AddTranslationDto {
  @IsInt()
  categoryId: number;

  @IsInt()
  languageId: number; // e.g., Amharic id

  @IsString()
  name: string;
}