import { Entity, Column, PrimaryColumn, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Clients } from './Clients';
import { Stories as Story } from './Stories';
import { StoryPropNames as StoryPropName } from './StoryPropNames';

@Entity()
export class AppUsers {

    @PrimaryGeneratedColumn()
    appUserId: number;

    @Column()
    externalAppUserId: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: "bigint" })
    phoneNumber;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    salt: string;

    @OneToOne(type => Users, user => user.appUser, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinColumn()
    user: Users;

    @OneToMany(type => Clients, client => client.employee, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    clients: Clients[];
}
