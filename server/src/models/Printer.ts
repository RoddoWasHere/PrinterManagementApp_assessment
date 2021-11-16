import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Printer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()//varchar(255)
    name: string;

    @Column({ length: 15 })
    ipAddress: string;

    @Column()
    isActive: boolean;
}

