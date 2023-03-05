import { IsBase64, IsDecimal, IsEnum, IsHexColor, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Size } from '../interfaces/sizes.enum';
import { Type } from 'class-transformer';
class Prueba {
    @IsString()
    a: string;
}
export class CreateProductVariation {
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
    @IsNotEmpty()
    image: string;    
}
