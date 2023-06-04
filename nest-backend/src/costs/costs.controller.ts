import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { integerCheckFormater } from '../utils';

@Controller('/api/costs')
export class CostsController {
  constructor(private readonly costsService: CostsService) {}

  @Post()
  async create(@Body() createCostDto: CreateCostDto) {
    try {
      const result = await this.costsService.create(createCostDto);
      return { success: true, dataValues: result };
    } catch (error) {
      return { success: false, msg: 'Add cost failed...' };
    }
  }

  @Get()
  async findAll(@Query('limit') limit, @Query('offset') offset) {
    try {
      if (limit !== undefined) limit = integerCheckFormater(limit, 1, 20);
      if (offset !== undefined)
        offset = integerCheckFormater(offset, 0, undefined);

      const costs = await this.costsService.findAll(limit, offset);
      return { success: true, costs: costs };
    } catch (error) {
      return { success: false, costs: [] };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCostDto: UpdateCostDto) {
    const result = await this.costsService.update(+id, updateCostDto);
    const success = id == result.id ? 1 : 0;

    return {
      success: success,
      msg: success
        ? `The cost[${id}] update success`
        : `The cost update failed`,
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
