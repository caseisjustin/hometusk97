import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Admin, Role.Owner)
  @ApiOperation({summary: 'User creation'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Owner)
  @ApiOperation({summary: 'Get All users'})
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Owner)
  @ApiOperation({summary: 'Get user by id'})
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Owner)
  @ApiOperation({summary: 'Update user with provided id'})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Put(':id/role')
  @Roles(Role.Admin)
  @ApiOperation({summary: 'Update user role with provided id'})
  async updateUserRole(@Param('id') userId: string, @Body('role') role: Role) {
    return this.userService.updateUserRole(userId, role);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({summary: 'Delete user with provided id'})
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
