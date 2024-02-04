import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./BaseEntity.entity";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { Purchases } from "./Purchases.entity";
import { PurchaseDetails } from "./PurchaseDetails.entity";

@Index("Users_pkey", ["id"], { unique: true })
@Entity("Users", { schema: "public" })
export class Users extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "Id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "Name", length: 200 })
  name: string;

  @Column("character varying", { name: "UserName", length: 100 })
  userName: string;

  @Column("character varying", { name: "Email", length: 200 })
  email: string;

  @Column("character varying", { name: "Address", length: 200 })
  address: string;

  @Column("character varying", { name: "Phone", length: 200 })
  phone: string;

  @Column("text", { name: "Password" })
  password: string;

  @Column("uuid", { name: "Salt" })
  salt: string;

  @Column("character varying", { name: "Image", length: 1000, nullable: true })
  image: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    comment: "ADMIN, CLIENT, SELLER",
    nullable: true,
  })
  role: string;

  @OneToMany(
    () => Purchases,
    (pr) => pr.buyer
  )
  prBuyer: Purchases[];

  @OneToMany(
    () => PurchaseDetails,
    (pr) => pr.seller
  )
  prSeller: PurchaseDetails[];

  @Column("boolean", { name: "Active", nullable: true })
  active: boolean | null;

  @Column("integer", {
    name: "Points",
    nullable: true,
    default: 0,
  })
  points: number;

  @Column("timestamp", { name: "Resetpointsat", nullable: true })
  resetpointsat: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;
}
