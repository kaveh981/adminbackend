import {
    Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, CreateDateColumn,
    ManyToOne
} from "typeorm";
import { Users } from "./Users";
import { AppUsers as AppUser } from './AppUsers';
import { Stories as Story } from './Stories';
import { StoryCategories as StoryCategory } from './StoryCategories';
import { StoryProperties } from './StoryProperties';

@Entity()
export class StoryPropNames {

    @PrimaryGeneratedColumn()
    propertyNameId: number;

    @Column({ unique: true })
    propertyName: string;

    @Column()
    status: Status;

    @CreateDateColumn()
    timestamp: Date

    @ManyToOne(type => StoryCategory, storyCategory => storyCategory.storyPropertyNames, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    storyCategory: StoryCategory;

    @ManyToOne(type => Users, user => user.storyPropNames, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    creator: Users;

    @OneToMany(type => StoryPropNames, storyPropName => storyPropName.propertyName, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    storyProperties: StoryProperties[];

}
