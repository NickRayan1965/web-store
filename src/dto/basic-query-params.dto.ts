import { IsBooleanString, IsInt, IsOptional, Min } from 'class-validator';

export class BasicQueryParams {
    @IsInt()
    @Min(0)
    @IsOptional()
    offset: number;
    @IsInt()
    @Min(0)
    @IsOptional()
    limit: number;
}