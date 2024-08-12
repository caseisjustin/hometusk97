import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Express } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary: 'Upload a file'})
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const createFileDto: CreateFileDto = {
      url: file.path,
      mimetype: file.mimetype,
      size: file.size,
      car_id: null,
    };
    return this.fileService.create(createFileDto);
  }

  @Get('belongs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @ApiOperation({summary: 'Get all files related to provided id'})
  findAll(@Param('id') id: string) {
    return this.fileService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get file by id'})
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Owner)
  @ApiOperation({summary: 'Delete file with provided id'})
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }
}
