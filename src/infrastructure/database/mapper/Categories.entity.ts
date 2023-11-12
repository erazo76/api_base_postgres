import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import { Products } from "./Products.entity";

@Index("Categories_pkey", ["id"], { unique: true })
@Entity("Categories", { schema: "public" })
export class Categories extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "Id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "Name", length: 200 })
  name: string;

  @Column("character varying", { name: "Image", length: 1000, nullable: true })
  image: string;

  @Column("character varying", {
    name: "Description",
    length: 500,
  })
  description: string;

  @Column("boolean", { name: "Active", nullable: true })
  active: boolean | null;

  @OneToMany(
    () => Products,
    (pr) => pr.category
  )
  products: Products[];
}
