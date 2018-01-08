import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Employees } from './Employees';

@Entity()
export class Clients {

    @PrimaryGeneratedColumn()
    clientId: number;

    @Column({ nullable: true })
    refreshToken: string;

    @ManyToOne(type => Employees, employee => employee.clients, {
        cascadeInsert: false, // allow to insert a new user on client save
        cascadeUpdate: true, // allow to update a user on client save
        cascadeRemove: false  // allow to remove a user on client remove
    })
    employee: Employees;

}