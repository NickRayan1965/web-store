import { IsString } from 'class-validator';

export class CategoriesDto {
    @IsString({each: true})
    categories: string[];
}