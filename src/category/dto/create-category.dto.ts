import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
  langCode: string;
  name: string;
}

export class CreateCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
