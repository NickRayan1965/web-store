import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity';
import { OrderDetail } from './order-detail.entity';
import { Address } from './address.entity';
import { ShippingType } from '../interfaces/shipping_type.enum';
import { OrderStatus } from '../interfaces/order-status.enum';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(()=>OrderDetail, orderDetail => orderDetail.order)
    orderDetails?: OrderDetail[];

    @Column('decimal')
    amount: number;

    @ManyToOne(() => Address)
    @JoinColumn()
    address: Address;

    @Column('varchar', {nullable: false})
    shipping_type: ShippingType; // 'express' 'pick_up_in_store' <<'on_scheduled_date'>>

    //scheduled_date: new Date(); //entrega esperada
    @Column('timestamp')
    reception_date: Date;

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false})
    shipping_cost: number;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

    @Column('varchar', {nullable: false})
    status: OrderStatus;

    @Column('boolean', {nullable: false})
    isActive: boolean;
}