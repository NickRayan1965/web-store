import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ValidRoles } from '../interfaces/valid_roles.interface';
import { Cart, Address,  } from './';
import { Order } from './order.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {unique: true, length: 255, nullable: false})
    email: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;

    @Column({type: 'varchar', length: 8, unique: true, nullable: false})
    dni: string;
 
    @Column('varchar', { nullable: false})
    first_names: string;

    @Column('varchar', {nullable: false})
    last_names: string;

    @Column('char', {nullable: false})
    sex: string;

    @Column('timestamptz', { nullable: false})
    birth_date: string | Date;
    @OneToMany(
        () => Address,
        address => address.user
    )
    addresses?: Address[];
    
    

    @Column('varchar', {length: '20', nullable: false})
    phone_number: string;

    @Column('varchar', {array: true, default: [ValidRoles.customer]})
    roles: ValidRoles[];

    @OneToOne(() => Cart, {cascade: true, nullable: true})
    @JoinColumn()
    cart: Cart;

    @OneToMany(() => Order, order => order.user)
    orders?: Order[];

    @Column('boolean', { default: false })
    email_confirmed: boolean;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: 'boolean', default: true})
    isActive: boolean;
}
