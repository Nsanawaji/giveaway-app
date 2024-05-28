import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Item } from './item.entity';
import { userRole } from 'src/enum/role.enum';

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
  token: string;

  @Column({ default: '' })
  profilePicture: string;

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.member,
  })
  role: userRole;

  @Column({ default: false })
  isBlock: boolean;

  @OneToMany(() => Item, (item) => item.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  item: Item[];
}
