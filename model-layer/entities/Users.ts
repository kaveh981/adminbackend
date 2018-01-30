import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Employees } from './Employees';
import { AppUsers } from './AppUsers';

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    name: string;

    @Column()
    family: string;

    @OneToOne(type => Employees, employee => employee.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    employee: Employees;

    @OneToOne(type => AppUsers, appUser => appUser.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    appUser: AppUsers;
}
