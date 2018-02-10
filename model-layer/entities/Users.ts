import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { Employees } from './Employees';
import { AppUsers } from './AppUsers';
import { StoryPropNames } from './StoryPropNames';
import { Stories } from './Stories';

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
        cascadeUpdate: true
    })
    employee: Employees;

    @OneToOne(type => AppUsers, appUser => appUser.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    appUser: AppUsers;

    @OneToMany(type => StoryPropNames, storyPropName => storyPropName.creator, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    storyPropNames: StoryPropNames[];

    @OneToMany(type => Stories, story => story.creator, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    stories: Stories[];
}
