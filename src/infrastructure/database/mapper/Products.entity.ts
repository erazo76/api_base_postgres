import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import { Categories } from "./Categories.entity";
import { PurchaseDetails } from "./PurchaseDetails.entity";

@Index("Products_pkey", ["id"], { unique: true })
@Entity("Products", { schema: "public" })
export class Products extends BaseEntity {
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

  @Column("character varying", {
    name: "Brand",
    length: 100,
  })
  brand: string;

  @Column("float", {
    name: "Price",
  })
  price: number;

  @Column("float", {
    name: "Cost",
    nullable: true,
  })
  cost: number;

  @Column("integer", {
    name: "Stock",
  })
  stock: number;

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

  @ManyToOne(
    () => Categories,
    (category) => category.products,
    { nullable: false }
  )
  category: Categories;

  @OneToMany(
    () => PurchaseDetails,
    (pr) => pr.product
  )
  prProduct: PurchaseDetails[];
}
