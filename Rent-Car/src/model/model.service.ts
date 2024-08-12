import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ModelService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(createModelDto: CreateModelDto) {
    return this.prisma.model.create({
      data: createModelDto,
    });
  }

  async findAll() {
    const models = await this.cacheManager.get('models');
    if (models) {
      return models;
    }

    let data = await this.prisma.model.findMany();
    if (data) {
      this.cacheManager.set('models', data, 20000);
      return data;
    }
    return "Couldn't find";
  }

  findOne(id: string) {
    return this.prisma.model.findUnique({
      where: { id },
    });
  }

  update(id: string, updateModelDto: UpdateModelDto) {
    return this.prisma.model.update({
      where: { id },
      data: updateModelDto,
    });
  }

  remove(id: string) {
    return this.prisma.model.delete({
      where: { id },
    });
  }
}
