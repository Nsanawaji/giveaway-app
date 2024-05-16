import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Item } from './item.entity';

@Entity()
export class User extends Base {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  location: string;

  @Column({ default: '' })
  gender: string;

  @Column({ default: '' })
  profilePicture: string;

  @OneToMany(() => Item, (item) => item.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  item: Item[];
}
