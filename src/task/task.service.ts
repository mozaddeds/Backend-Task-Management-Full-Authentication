import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto'
import { TaskStatus, Priority, Prisma } from '../../generated/prisma';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || TaskStatus.PENDING,
        priority: createTaskDto.priority || Priority.MEDIUM,
        dueDate: createTaskDto.dueDate,
        project: { connect: { id: createTaskDto.projectId } },
        createdBy: { connect: { id: createTaskDto.createdById } },
        ...(createTaskDto.assignedToId && {
          assignedTo: { connect: { id: createTaskDto.assignedToId } },
        }),
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: true,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        project: true,
        comments: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const updateData: Prisma.TaskUpdateInput = {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        dueDate: updateTaskDto.dueDate,
        ...(updateTaskDto.projectId && {
          project: { connect: { id: updateTaskDto.projectId } },
        }),
        ...(updateTaskDto.createdById && {
          createdBy: { connect: { id: updateTaskDto.createdById } },
        }),
        ...(updateTaskDto.assignedToId && {
          assignedTo: { connect: { id: updateTaskDto.assignedToId } },
        }),
      };

      return await this.prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      });
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async searchTasks(query: string) {
    return this.prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        assignedTo: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
    });
  }
}