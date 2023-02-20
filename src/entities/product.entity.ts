import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ProductVariation } from './product-variation.entity';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;




  @ManyToMany(type => Category)
  @JoinTable()
  categories?: Category[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;

  @OneToMany(() => ProductVariation, variation => variation.product)
  variations?: ProductVariation[];
}
