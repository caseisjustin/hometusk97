import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CarService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
    });
  }

  async findAll() {
    const cars = await this.cacheManager.get('cars');
    if (cars) {
      return cars;
    }

    let data = await this.prisma.car.findMany();
    if (data) {
      this.cacheManager.set('cars', data, 20000);
      return data;
    }
    return "Couldn't find";
  }

  findOne(id: string) {
    return this.prisma.car.findUnique({
      where: { id },
    });
  }

  findByCompanyId(companyId: string) {
    return this.prisma.car.findMany({
      where: { company_id: companyId },
    });
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  remove(id: string) {
    return this.prisma.car.delete({
      where: { id },
    });
  }
}
