import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Employees } from './Employees';

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    name: string;

    @Column({ unique: true })
    family: string;

    @OneToOne(type => Employees, employee => employee.user)
    employee: Employees;
}
