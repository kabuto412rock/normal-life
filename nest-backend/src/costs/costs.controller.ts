import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { integerCheckFormater } from '../utils';

@Controller('/api/costs')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CostsController {
  constructor(private readonly costsService: CostsService) {}

  @Post()
  async create(@Body() createCostDto: CreateCostDto) {
    try {
      const result = await this.costsService.create(createCostDto);
      return { success: 1, dataValues: result };
    } catch (error) {
      return { success: 0, msg: 'Add cost failed...' };
    }
  }

  @Get()
  async findAll(@Query('limit') limit, @Query('offset') offset) {
    try {
      if (limit !== undefined) limit = integerCheckFormater(limit, 1, 20);
      if (offset !== undefined)
        offset = integerCheckFormater(offset, 0, undefined);

      const costs = await this.costsService.findAll(limit, offset);
      return { success: 1, costs: costs };
    } catch (error) {
      return { success: 0, costs: [] };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCostDto: UpdateCostDto) {
    // // 如果名稱、金額未填，返回錯誤
    // if (updateCostDto.cash || updateCostDto.name) {
    //   throw new HttpException(
    //     { success: 0, msg: '名稱、金額必須要填' },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const result = await this.costsService.update(+id, updateCostDto);
    if (+id != result.id) {
      throw new HttpException(
        { success: 0, msg: 'The cost update failed' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      success: 1,
      msg: `The cost[${id}] update success`,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const success = await this.costsService.remove(+id);

    return {
      success: success,
      msg: success
        ? `The cost[${id}] delete success`
        : `The cost delete fail...`,
    };
  }
}
