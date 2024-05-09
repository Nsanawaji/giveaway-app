import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { timeStamp } from 'console';

@Entity()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;
}
