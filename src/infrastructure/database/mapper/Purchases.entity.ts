import {
  BeforeUpdate,
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
import { PaymentEnum } from "infrastructure/enums/payment.enum";

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

  @Column("float", {
    name: "PaymentCash",
    nullable: true,
  })
  paymentCash: number;

  @Column("float", {
    name: "PaymentChange",
    nullable: true,
  })
  paymentChange: number;

  @Column({
    type: "enum",
    enum: StatusEnum,
    comment: "REQUESTED, ROUTED, DELIVERED, CANCELED",
    nullable: true,
  })
  status: string;

  @Column({
    type: "enum",
    enum: PaymentEnum,
    comment: "EFECTIVO, TRANSFERENCIA",
    nullable: true,
  })
  paymentType: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column("boolean", { name: "Active", nullable: true })
  active: boolean | null;

  @Column("boolean", { name: "Paymented", nullable: true })
  paymented: boolean | null;

  @Column("character varying", {
    name: "PaymentImage",
    length: 1000,
    nullable: true,
  })
  paymentImage: string;

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

  @BeforeUpdate()
  updatePaymentChange() {
    if (this.paymentCash !== null && this.total !== null) {
      this.paymentChange = this.paymentCash - this.total;
    }
  }
}
