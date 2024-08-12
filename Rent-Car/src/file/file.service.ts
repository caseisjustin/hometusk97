import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(createFileDto: CreateFileDto) {
    return this.prisma.file.create({
      data: createFileDto,
    });
  }

  async findAll() {
    const files = await this.cacheManager.get('files');
    if (files) {
      return files;
    }

    let data = await this.prisma.file.findMany();
    if (data) {
      this.cacheManager.set('files', data, 20000);
      return data;
    }
    return "Couldn't find";
  }

  findOne(id: string) {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.file.delete({
      where: { id },
    });
  }
}
