import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Size } from '../interfaces/sizes.enum';
import { CartItem } from './cart-item.entity';
import { OrderDetail } from './order-detail.entity';

@Entity()
export class ProductVariation {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  size: Size;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({ type: 'decimal', scale: 2, nullable: false })
  price: number;
  
  @Column('varchar', {nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, product => product.variations)
  @JoinColumn()
  product?: Product;

  @OneToMany( () => CartItem, cartItem => cartItem.product )
  cartItems?: CartItem[];

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  orderDetails?: OrderDetail[];

  @Column('boolean', {nullable: false, default: true})
  isActive: boolean;
}
