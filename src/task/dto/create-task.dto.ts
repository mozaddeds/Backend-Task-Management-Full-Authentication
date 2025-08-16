import { IsString, IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { TaskStatus, Priority } from '../../../generated/prisma';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsInt()
  projectId: number;

  @IsInt()
  createdById: number;

  @IsOptional()
  @IsInt()
  assignedToId?: number;
}