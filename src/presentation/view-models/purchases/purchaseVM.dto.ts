import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type, plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { UserVM } from "../users/userVM.dto";
import { PurchaseDetailVM } from "../purchaseDetails/purchaseDetailVM.dto";

export class SimplifiedUserVM {
  @Expose()
  @ApiProperty({
    description: "Name of buyer",
    required: false,
    example: "John Doe",
    type: String,
  })
  name: string;

  // Otros campos que desees exponer en esta versión simplificada

  constructor(buyer: UserVM) {
    // Verifica si buyer no es undefined antes de acceder a sus propiedades
    if (buyer) {
      this.name = buyer.name;
      // Asigna otros campos según sea necesario
    } else {
      // Si buyer es undefined, puedes asignar un valor predeterminado o manejarlo según tus necesidades
      this.name = "N/A"; // O cualquier otro valor predeterminado
    }
  }
}

export class PurchaseVM {
  @Expose()
  @ApiProperty({
    description: "Id of purchase",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Total purchase",
    example: "12.5",
    type: Number,
  })
  total: number;

  @Expose()
  @ApiProperty({
    description: "Status of purchase",
    example: "REQUESTED | ROUTED | DELIVERED | CANCELED",
    type: String,
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: "Check if the purchase is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = true;

  @Expose()
  @Type(() => SimplifiedUserVM)
  @ApiProperty({
    description: "Id of userBuyer",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: SimplifiedUserVM,
  })
  buyer: SimplifiedUserVM;

  @Expose()
  @Type(() => PurchaseDetailVM)
  @ApiProperty({
    description: "Id of userBuyer",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  prDetail: PurchaseDetailVM;

  @Expose()
  @ApiProperty({
    description: "Date created of purchase",
    example: "21/08/2023 10:50:15",
    type: String,
  })
  createdAt: string;

  static toViewModel(module: Purchases): PurchaseVM {
    return plainToClass(PurchaseVM, module, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static fromViewModel(mv: PurchaseVM): Purchases {
    return plainToClass(Purchases, mv, { excludeExtraneousValues: true });
  }
}
