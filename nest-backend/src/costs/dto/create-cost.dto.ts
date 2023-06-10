import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
  isNumber,
  length,
} from 'class-validator';

export class CreateCostDto {
  /** 花費名稱 */
  @IsNotEmpty()
  @Length(1, 10)
  @IsString()
  name: string;

  /** 花費金額 */
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  cash: number;

  /** 備註 */
  @IsString()
  remark: string;
}
