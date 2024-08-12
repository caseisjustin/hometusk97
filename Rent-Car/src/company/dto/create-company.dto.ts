import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  owner: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  logo?: string;
}
