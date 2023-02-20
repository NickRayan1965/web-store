import { BeforeInsert, Column, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariation } from './product-variation.entity';
import { TypeDiscount } from '../interfaces/type-discount.enum';
import { Order } from './order.entity';

export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: 1;
    
    @ManyToOne(() => Product)
    @JoinColumn()
    product: ProductVariation;

    @Column('int', {nullable: false})
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @ManyToOne(() => Order, order => order.orderDetails)
    @JoinColumn()
    order: Order;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    subtotal: number;

    @BeforeInsert()
    calculateSubtotal() {
        this.subtotal = this.quantity * this.price;
        this.subtotal = +this.subtotal.toFixed(2);
    }
}