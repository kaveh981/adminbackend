import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany, OneToMany, JoinColumn } from "typeorm";
import { Users } from "./Users";
import { Roles } from './Roles';
import { Clients } from './Clients';

@Entity()
export class Employees {

    @PrimaryGeneratedColumn()
    employeeId: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToOne(type => Users, user => user.employee)
    @JoinColumn()
    user: Users;

    @ManyToMany(type => Roles, role => role.employees)
    employeesRoles: Roles[];

    @OneToMany(type => Clients, client => client.employee, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    clients: Clients[];
}
