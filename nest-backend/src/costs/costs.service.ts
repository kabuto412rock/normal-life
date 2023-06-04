import { Injectable } from '@nestjs/common';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cost } from './cost.model';

@Injectable()
export class CostsService {
  constructor(
    @InjectModel(Cost)
    private costModel: typeof Cost,
  ) {}
  create(createCostDto: CreateCostDto) {
    return this.costModel.create({
      ...createCostDto,
    });
  }

  findAll(limit: number, offset: number): Promise<Cost[]> {
    return this.costModel.findAll({
      limit,
      offset,
    });
  }

  findOne(id: number) {
    return this.costModel.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCostDto: UpdateCostDto): Promise<Cost> {
    const cost = await this.costModel.findOne({ where: { id } });
    return cost.update({ ...updateCostDto });
  }

  async remove(id: number): Promise<number> {
    return this.costModel.destroy({ where: { id } });
  }
}
