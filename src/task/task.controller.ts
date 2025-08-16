import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam, 
  ApiBody
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Task created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Implement authentication',
        status: 'PENDING',
        priority: 'MEDIUM',
        projectId: 1,
        createdById: 1
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires editor/admin role' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tasks',
    schema: {
      example: [{
        id: 1,
        title: 'Implement authentication',
        status: 'PENDING',
        assignedTo: { name: 'John Doe' }
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tasks' })
  @ApiQuery({ name: 'q', description: 'Search term', example: 'auth' })
  @ApiResponse({ 
    status: 200, 
    description: 'Matching tasks',
    schema: {
      example: [{
        id: 1,
        title: 'Implement authentication',
        description: 'Set up JWT auth'
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  search(@Query('q') query: string) {
    return this.tasksService.searchTasks(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Task details',
    schema: {
      example: {
        id: 1,
        title: 'Implement authentication',
        status: 'PENDING',
        project: { title: 'API Development' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Updated task',
    schema: {
      example: {
        id: 1,
        title: 'Implement authentication',
        status: 'IN_PROGRESS'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}