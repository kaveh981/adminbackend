import {
    ClosureEntity, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent,
    TreeLevelColumn, OneToOne, ManyToMany, OneToMany, JoinColumn
} from "typeorm";
import { Users } from "./Users";
import { Roles } from './Roles';
import { Clients } from './Clients';

@ClosureEntity()
export class Employees {

    @PrimaryGeneratedColumn()
    employeeId: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @TreeChildren({ cascadeInsert: true, cascadeUpdate: true })
    children: Employees[];

    @TreeParent()
    parent: Employees;

    @TreeLevelColumn()
    level: number;

    @OneToOne(type => Users, user => user.employee, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    @JoinColumn()
    user: Users;

    @ManyToMany(type => Roles, role => role.employees,{
        cascadeInsert: true,
        cascadeUpdate: true
    })
    employeesRoles: Roles[];

    @OneToMany(type => Clients, client => client.employee, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    clients: Clients[];
}
