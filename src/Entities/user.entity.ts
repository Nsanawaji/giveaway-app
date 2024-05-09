import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

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
}