import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateProductVariation } from './update-product-variation.dto';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    brand?: string;

    @IsString()
    @IsOptional()
    mainImage: string;

    @IsString({each: true})
    @IsOptional()
    categories?: string[];

    @Type(()=>UpdateProductVariation)
    @ValidateNested()
    @IsOptional()
    variations?: 
    UpdateProductVariation[];
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}