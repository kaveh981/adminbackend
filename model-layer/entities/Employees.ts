import { Entity, Column, PrimaryGeneratedColumn, OneToOne,ManyToMany, JoinColumn } from "typeorm";
import { Users } from "./Users";
import {EmployeeRoles} from './EmployeeRoles';

@Entity()
export class Employees {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @OneToOne(type => Users, user => user.employee)
    @JoinColumn()
    user: Users;

    @ManyToMany(type => EmployeeRoles, employeeRole => employeeRole.roles)
    employees: Employees[];
}