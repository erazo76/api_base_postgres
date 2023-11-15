import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type, plainToClass } from "class-transformer";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";
import { UserVM } from "../users/userVM.dto";
import { ProductVM } from "../products/productVM.dto";
import { PurchaseVM } from "../purchases/purchaseVM.dto";

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

  constructor(seller: UserVM) {
    // Verifica si buyer no es undefined antes de acceder a sus propiedades
    if (seller) {
      this.name = seller.name;
      // Asigna otros campos según sea necesario
    } else {
      // Si buyer es undefined, puedes asignar un valor predeterminado o manejarlo según tus necesidades
      this.name = "N/A"; // O cualquier otro valor predeterminado
    }
  }
}

export class PurchaseDetailVM {
  @Expose()
  @ApiProperty({
    description: "Id of purchaseDetail",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Subtotal purchaseDetail",
    example: "12.5",
    type: Number,
  })
  subtotal: number;

  @Expose()
  @ApiProperty({
    description: "Cost of product",
    example: "12.5",
    type: Number,
  })
  cost: number;

  @Expose()
  @ApiProperty({
    description: "Quantity of products",
    example: "12.5",
    type: Number,
  })
  quantity: number;

  @Expose()
  @Type(() => ProductVM)
  @ApiProperty({
    description: "Id of userSeller",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  product: ProductVM;

  @Expose()
  @Type(() => SimplifiedUserVM)
  @ApiProperty({
    description: "Id of userSeller",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: SimplifiedUserVM,
  })
  seller: SimplifiedUserVM;

  @Expose()
  @Type(() => PurchaseVM)
  @ApiProperty({
    description: "Id of userSeller",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  detail: PurchaseVM;

  @Expose()
  @ApiProperty({
    description: "Date created of purchaseDetail",
    example: "21/08/2023 10:50:15",
    type: String,
  })
  createdAt: string;

  static toViewModel(module: PurchaseDetails): PurchaseDetailVM {
    return plainToClass(PurchaseDetailVM, module, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static fromViewModel(mv: PurchaseDetailVM): PurchaseDetails {
    return plainToClass(PurchaseDetails, mv, { excludeExtraneousValues: true });
  }
}
