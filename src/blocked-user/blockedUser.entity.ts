import { Base } from 'src/Entities/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class BlockedUser extends Base {
  @Column()
  userId: string;

  @Column()
  userEmail: string

  @Column()
  adminId: string;

 
}
