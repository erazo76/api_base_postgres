import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";

@Index("Banks_pkey", ["id"], { unique: true })
@Entity("Banks", { schema: "public" })
export class Banks extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "Id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "Name", length: 200 })
  name: string;

  @Column("character varying", {
    name: "Url_Image",
    length: 1000,
    nullable: true,
  })
  urlImage: string;

  @Column("character varying", {
    name: "Account",
    length: 500,
  })
  account: string;

  @Column("character varying", {
    name: "Type",
    length: 500,
  })
  type: string;

  @Column("boolean", { name: "Active", nullable: true })
  active: boolean | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @UpdateDateColumn({
    type: "timestamp",
    name: "Updated_At",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: string;
}
