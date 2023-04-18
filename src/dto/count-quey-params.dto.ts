import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class CountQueryParams{
    @IsBooleanString()
    @IsOptional()
    isActive: string | boolean;
    
    @IsString()
    @IsOptional()
    titleFilter: string;
}