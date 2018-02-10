import {
    ClosureEntity, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent,
    TreeLevelColumn, OneToOne, ManyToMany, OneToMany, JoinColumn
} from "typeorm";
import { Users } from "./Users";
import { Roles } from './Roles';
import { Stories as Story } from './Stories';
import { StoryPropNames as StoryPropName } from './StoryPropNames'

@ClosureEntity()
export class StoryCategories {

    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column()
    category: string;

    @TreeChildren({ cascadeInsert: true, cascadeUpdate: true })
    children: StoryCategories[];

    @TreeParent()
    parent: StoryCategories;

    @TreeLevelColumn()
    level: number;

    @OneToOne(type => Users, user => user.employee, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinColumn()
    user: Users;

    @OneToMany(type => Story, story => story.storyCategory, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    stories: Story[];

    @OneToMany(type => StoryPropName, storyPropName => storyPropName.storyCategory, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    storyPropertyNames: StoryPropName[];

}
