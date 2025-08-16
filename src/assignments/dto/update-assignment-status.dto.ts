import { IsEnum, IsOptional } from 'class-validator';
import { AssignmentStatus } from '../assignment.entity';

export class UpdateAssignmentStatusDto {
  @IsEnum(['pending', 'answered', 'rejected'])
  status: AssignmentStatus;

  @IsOptional()
  answeredAt?: Date;
}
