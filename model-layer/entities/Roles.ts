import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Employees } from './Employees';
import { Routes } from './Routes';
@Entity()
export class Roles {

    @PrimaryGeneratedColumn()
    roleId: number;

    @Column()
    role: string;

    @ManyToMany(type => Employees, employee => employee.employeesRoles)
    @JoinTable()
    employees: Employees[];

     @OneToMany(type => Routes, route => route.role, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    routes: Routes[];

}