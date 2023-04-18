import { Product, ProductVariation } from "../../entities";
export type RawProduct = Omit<
  Product,
  "categories" | "brand"
> & {categories: string[], brand: string};
export const productConverterToRaw = (data: Product | Product[]): RawProduct | RawProduct[] => {
  const productToRaw = (product: Product): RawProduct => {
    return {
      ...product,
      categories: product.categories.map((category) => category.name),
      brand: product.brand.name,
    };
  };
  if (!Array.isArray(data)) {
    return productToRaw(data);
  }
  return data.map(product => productToRaw(product));
};
