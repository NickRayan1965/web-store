import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { BasicQueryParams } from './basic-query-params.dto';

export class FindProductsQueryParamsDto extends BasicQueryParams{
  @IsString()
  @IsOptional()
  titleFilter: string;
  @IsBooleanString()
  @IsOptional()
  isActive: string | boolean;
  @IsBooleanString()
  @IsOptional()
  haveVariations: string | boolean;
}