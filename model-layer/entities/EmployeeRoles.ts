import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Employees } from './Employees';
import { Menus } from './Menus';
@Entity()
export class EmployeeRoles {

    @PrimaryGeneratedColumn()
    roleId: number;

    @Column()
    role: string;

    @ManyToMany(type => Employees, employee => employee.employees)
    roles: EmployeeRoles[];

    @OneToMany(type => Menus, menu => menu.role)
    menus: Menus[];
}