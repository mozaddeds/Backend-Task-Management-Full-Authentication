import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { TaskStatus, Priority } from '../../../generated/prisma';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement authentication',
    description: 'Task title',
    required: true
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Implement JWT authentication for the API',
    description: 'Task description',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description: 'Task status',
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    enum: Priority,
    example: Priority.MEDIUM,
    description: 'Task priority',
    required: false
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Task due date',
    required: false
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    example: 1,
    description: 'ID of the project this task belongs to',
    required: true
  })
  @IsInt()
  projectId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the user creating this task',
    required: true
  })
  @IsInt()
  createdById: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the user assigned to this task',
    required: false
  })
  @IsOptional()
  @IsInt()
  assignedToId?: number;
}