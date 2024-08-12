import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsJSON,
  IsDateString,
} from 'class-validator';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsUUID()
  @ApiProperty()
  company_id: string;

  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsJSON()
  user_data: string;

  @ApiProperty()
  @IsUUID()
  car_id: string;

  @ApiProperty()
  @IsJSON()
  car_data: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsDateString()
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  end_date: Date;

  @ApiProperty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty()
  @IsUUID()
  created_by: string;

  @ApiProperty()
  @IsUUID()
  last_edited_by: string;
}
