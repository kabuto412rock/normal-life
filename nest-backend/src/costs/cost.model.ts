import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'daily_costs', timestamps: true })
export class Cost extends Model {
  @Column
  name: string;

  @Column(DataType.INTEGER)
  cash: number;

  @Column
  remark: string;
}
