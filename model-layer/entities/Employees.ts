import { Entity, Column, PrimaryGeneratedColumn, OneToOne,ManyToMany, JoinColumn } from "typeorm";
import { Users } from "./Users";
import {Roles} from './Roles';

@Entity()
export class Employees {

    @PrimaryGeneratedColumn()
    employeeId: number;

    @Column()
    email: string;

    @OneToOne(type => Users, user => user.employee)
    @JoinColumn()
    user: Users;

    @ManyToMany(type => Roles, role => role.employees)
    employeesRoles: Roles[];
}
