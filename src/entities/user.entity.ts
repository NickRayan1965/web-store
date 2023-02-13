import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ValidRoles } from '../interfaces/valid_roles.interface';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', unique: true, length: 255, nullable: false})
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

    @Column('varchar', {length: '20', nullable: false})
    phone_number: string;

    @Column('varchar', {array: true, default: [ValidRoles.customer]})
    roles: ValidRoles[];

    @Column('boolean', { default: false })
    email_confirmed: boolean;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: 'boolean', default: true})
    isActive: boolean;
}
