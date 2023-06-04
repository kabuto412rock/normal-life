import { Module } from '@nestjs/common';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cost } from './cost.model';

@Module({
  imports: [SequelizeModule.forFeature([Cost])],
  controllers: [CostsController],
  providers: [CostsService],
  exports: [CostsService],
})
export class CostsModule {}
