import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      phone,
      full_name,
      avatar,
      password,
      emailVerificationToken,
      emailVerificationTokenExpires,
    } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        full_name,
        email,
        avatar,
        password,
        phone,
        emailVerificationToken,
        emailVerificationTokenExpires,
        role: createUserDto.role,
        isActive: false,
      },
    });

    return user;
  }

  async updateUserRole(userId: string, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async findAll(requestedRole?: Role) {
    if (requestedRole && ![Role.Admin, Role.Owner].includes(requestedRole)) {
      throw new ForbiddenException(
        'You do not have permission to view all users.',
      );
    }
    const users = await this.cacheManager.get('users');
    if (users) {
      return users;
    }

    let data = await this.prisma.user.findMany();
    if (data) {
      this.cacheManager.set('users', data, 20000);
      return data;
    }
    return "Couldn't find";
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByFullName(full_name: string) {
    const user = await this.prisma.user.findFirst({ where: { full_name } });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        role: updateUserDto.role as Role, // Typecasting to avoid type mismatch
      },
    });
  }

  async confirmPassword(email: string, newPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }

  async confirmEmail(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        emailVerificationTokenExpires: null,
        emailVerificationToken: null,
      },
    });
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: updatePasswordDto.newPassword },
    });
  }

  // async updateVerificationStatus(email: string, isVerified: boolean): Promise<void> {
  //   const user = await this.prisma.user.findUnique({ where: { email } });

  //   if (!user) {
  //     throw new NotFoundException(`User with email ${email} not found`);
  //   }

  //   await this.prisma.user.update({
  //     where: { email },
  //     data: { isActive: isVerified },
  //   });
  // }

  async updateVerificationStatus(email: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { email },
      data: { isActive },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
