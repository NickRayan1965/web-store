import { IsOptional, IsString } from 'class-validator';

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


    @IsString({each: true})
    @IsOptional()
    categories?: string[];
}