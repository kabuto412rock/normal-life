import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CostsModule } from './costs/costs.module';
import { Cost } from './costs/cost.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      models: [Cost],
      autoLoadModels: true,
      synchronize: true,
    }),
    CostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
