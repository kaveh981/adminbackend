import {
    Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, CreateDateColumn,
    ManyToOne
} from "typeorm";
import { Users } from "./Users";
import { AppUsers as AppUser } from './AppUsers';
import { Stories as Story } from './Stories';
import { StoryCategories as StoryCategory } from './StoryCategories';

@Entity()
export class StoryPropNames {

    @PrimaryGeneratedColumn()
    propertyId: number;

    @Column()
    propertyName: string;

    @Column()
    visible: boolean;

    @CreateDateColumn()
    timestamp: Date

    @OneToOne(type => Users, user => user.employee)
    @JoinColumn()
    user: Users;

    @ManyToOne(type => StoryCategory, storyCategory => storyCategory.storyPropertyNames)
    storyCategory: StoryCategory;

    @ManyToOne(type => AppUser, appUser => appUser.storyPropertyNames)
    creator: AppUser;

}
