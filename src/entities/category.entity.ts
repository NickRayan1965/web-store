import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('varchar', {unique: true, nullable: false})
    name: string;

    @ManyToMany(type => Product, product => product.categories)
    products: Product[];
    
    @Column('boolean', {nullable: false, default: true})
    isActive: boolean;
}
