import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;
    @Column({type: 'boolean', default: true})
    isActive: boolean;
    @OneToMany(()=> Product, product => product.brand)
    products?: Product[]
}