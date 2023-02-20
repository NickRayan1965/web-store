import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @OneToOne(() => User, user => user.cart )
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
  
    items: CartItem[];

    @Column({ default: true })
    isActive: boolean;
}
