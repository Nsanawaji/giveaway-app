import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Item extends Base {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => User, (user) => user.item)
  user: User;
}
