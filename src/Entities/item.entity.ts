import { Entity, Column } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class Item extends Base {

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;


}