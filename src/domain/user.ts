import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    address: string;

    @Column()
    isActive: boolean;

    @Column('decimal', { precision: 21, scale: 2, default: 0 })
    score: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt?: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt?: Date;
}
