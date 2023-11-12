import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import { StatusEnum } from "infrastructure/enums/status.enum";
import { Users } from "./Users.entity";
import { PurchaseDetails } from "./PurchaseDetails.entity";

@Index("Purchases_pkey", ["id"], { unique: true })
@Entity("Purchases", { schema: "public" })
export class Purchases extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "Id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("float", {
    name: "Total",
  })
  total: number;

  @Column({
    type: "enum",
    enum: StatusEnum,
    comment: "REQUESTED, ROUTED, DELIVERED, CANCELED",
    nullable: true,
  })
  status: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column("boolean", { name: "Active", nullable: true })
  active: boolean | null;

  @ManyToOne(
    () => Users,
    (buye) => buye.prBuyer,
    { nullable: false }
  )
  buyer: Users;

  @OneToMany(
    () => PurchaseDetails,
    (pr) => pr.detail
  )
  prDetail: PurchaseDetails[];
}
