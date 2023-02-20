import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {nullable: false})
    department: string;

    @Column('varchar', {nullable: false})
    province: string;

    @Column('varchar', {nullable: false})
    district: string;

    @Column('varchar', {nullable: false})
    zone: string; //avenida calle jirón

    @Column('varchar', {nullable: false})
    number: number; //de la avenida calle jiron

    @Column('varchar', {nullable: false})
    housing_indications: string; //Casa 3, Dpto 101 piso 2

    @Column('varchar', {nullable: true})
    references: string;

    @ManyToOne(
        () => User,
        user => user.addresses
    )
    @JoinColumn()
    user: User;

    @OneToMany(() => Order, order => order.address)
    orders?: Order[]
}