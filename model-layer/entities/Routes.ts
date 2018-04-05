import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Roles } from './Roles';
@Entity()
export class Routes {

    @PrimaryGeneratedColumn()
    routeId: number;

    @Column()
    route: string;

    @Column()
    method: Method;

     @ManyToOne(type => Roles, role => role.routes, {
        cascadeInsert: false, // allow to insert a new user on client save
        cascadeUpdate: true, // allow to update a user on client save
        cascadeRemove: false  // allow to remove a user on client remove
    })
    role: Roles;

}