import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Employees } from './Employees';
@Entity()
export class Roles {

    @PrimaryGeneratedColumn()
    roleId: number;

    @Column()
    role: string;

    @ManyToMany(type => Employees, employee => employee.employeesRoles)
    @JoinTable()
    employees: Employees[];

}