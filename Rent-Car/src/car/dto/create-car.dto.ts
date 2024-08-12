import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  model_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  company_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  info: string;
}
