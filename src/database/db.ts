import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../entities/user.entity";
import EnvConfiguration from "../config/app.config";
import {
  Address,
  Cart,
  CartItem,
  Category,
  Order,
  OrderDetail,
  Product,
  ProductVariation,
} from "../entities";
import { Brand } from "../entities/brand.entity";
const { NODE_ENV } = EnvConfiguration;
const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  ...EnvConfiguration[NODE_ENV],
  port: +EnvConfiguration[NODE_ENV].port,
  entities: [
    User,
    Address,
    Cart,
    CartItem,
    Category,
    Order,
    OrderDetail,
    ProductVariation,
    Product,
    Brand,
  ],
  synchronize: true,
};
export const AppDataSource = new DataSource(dataSourceOptions);
