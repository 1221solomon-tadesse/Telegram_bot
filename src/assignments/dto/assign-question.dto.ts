import { IsInt } from 'class-validator';

export class AssignQuestionDto {
  @IsInt()
  questionId: number;

  @IsInt()
  userId: number;
}
