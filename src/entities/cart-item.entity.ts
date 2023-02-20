import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Cart } from './cart.entity';
import { ProductVariation } from './product-variation.entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductVariation)
    @JoinColumn()
    product: ProductVariation;

    @ManyToOne(() => Cart, (cart) => cart.items, { cascade: true })
    cart?: Cart;

    @Column()
    quantity: number;


    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

    
}