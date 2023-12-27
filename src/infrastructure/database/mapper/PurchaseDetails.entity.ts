import { Column, CreateDateColumn, Entity, Index, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import { Users } from "./Users.entity";
import { Products } from "./Products.entity";
import { Purchases } from "./Purchases.entity";

@Index("PurchaseDetails_pkey", ["id"], { unique: true })
@Entity("PurchaseDetails", { schema: "public" })
export class PurchaseDetails extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "Id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("float", {
    name: "SubTotal",
  })
  subtotal: number;

  @Column("float", {
    name: "Cost",
    nullable: true,
  })
  cost: number;

  @Column("integer", {
    name: "Quantity",
  })
  quantity: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column("boolean", { name: "Active", nullable: true })
  active: boolean | null;

  @ManyToOne(
    () => Users,
    (sell) => sell.prSeller,
    { nullable: false }
  )
  seller: Users;

  @ManyToOne(
    () => Products,
    (prod) => prod.prProduct,
    { nullable: false }
  )
  product: Products;

  @ManyToOne(
    () => Purchases,
    (purch) => purch.prDetail,
    { nullable: true }
  )
  detail: Purchases;
}
