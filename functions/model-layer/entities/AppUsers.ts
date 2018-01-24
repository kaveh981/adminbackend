import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Users } from "./Users";
import { Clients } from './Clients';
import { Stories as Story } from './Stories';

@Entity()
export class AppUsers {

    @PrimaryGeneratedColumn()
    appUserId: number;

    @Column()
    email: string;

    @Column()
    phoneNumber: number;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToOne(type => Users, user => user.employee)
    @JoinColumn()
    user: Users;

    @OneToMany(type => Clients, client => client.employee, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    clients: Clients[];

    @OneToMany(type => Story, story => story.creator)
    stories: Story[];
}
