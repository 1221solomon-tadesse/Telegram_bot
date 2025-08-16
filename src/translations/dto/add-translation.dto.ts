import { IsInt, IsString } from 'class-validator';

export class AddTranslationDto {
  @IsInt()
  questionId: number;

  @IsInt()
  languageId: number; // e.g., Amharic id

  @IsString()
  title: string;

  @IsString()
  content: string;
}
