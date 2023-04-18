import { IsEnum, IsHexColor, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Size } from '../interfaces/sizes.enum';

export class UpdateProductVariation {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEnum(Size)
  size: Size;
  
  @IsHexColor()
  color: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsNumber({maxDecimalPlaces: 2})
  price: number;

  @IsString()
  @IsOptional()
  image?: string;    
}
