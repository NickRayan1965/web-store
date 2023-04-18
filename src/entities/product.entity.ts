import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, JoinColumn, BaseEntity } from 'typeorm';
import { ProductVariation } from './product-variation.entity';
import { Category } from './category.entity';
import { Brand } from './brand.entity';

@Entity()
export class Product{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;
  
  @Column('text', {nullable: false})
  mainImage: string;

  @ManyToOne(()=>Brand, brand => brand.products, {cascade: true})
  @JoinColumn()
  brand: Brand;

  @ManyToMany(type => Category, {cascade: true, onDelete: 'CASCADE'})
  @JoinTable()
  categories?: Category[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @OneToMany(() => ProductVariation, variation => variation.product, {cascade: true})
  variations?: ProductVariation[];
}
