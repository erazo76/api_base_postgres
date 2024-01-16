import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";

@Index("Advertisements_pkey", ["id"], { unique: true })
@Entity("Advertisements", { schema: "public" })
export class Advertisements extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "Id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "Title", length: 200 })
  title: string;

  @Column("character varying", {
    name: "Url_Image",
    length: 1000,
    nullable: true,
  })
  urlImage: string;

  @Column("character varying", {
    name: "Description",
    length: 500,
  })
  description: string;

  @Column("character varying", {
    name: "Whatsapp",
    length: 500,
  })
  whatsapp: string;

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
