import { Inject, Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ConfigService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  create(createConfigDto: CreateConfigDto) {
    return 'This action adds a new config';
  }

  async findAll() {
    const configs = await this.cacheManager.get('configs');
    if (configs) {
      return configs;
    }

    let data = 'await this.prisma.company.findMany()';
    if (data) {
      this.cacheManager.set('configs', data, 20000);
      return data;
    }
    return "Couldn't find";
  }

  findOne(id: number) {
    return `This action returns a #${id} config`;
  }

  update(id: number, updateConfigDto: UpdateConfigDto) {
    return `This action updates a #${id} config`;
  }

  remove(id: number) {
    return `This action removes a #${id} config`;
  }
}
