import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateProductVariation } from './create-product-variation.dto';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsString()
    mainImage: string;

    @IsString({each: true})
    @IsOptional()
    categories?: string[]

    @IsString()
    @IsOptional()
    brand: string;

    @Type(()=>CreateProductVariation)
    @ValidateNested()
    @IsOptional()
    variations?: 
    CreateProductVariation[];
}
