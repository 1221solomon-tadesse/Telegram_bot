import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt()
  languageId: number;
  @IsInt()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  createdByUserId?: number;
}
