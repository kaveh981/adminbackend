import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, ManyToMany, CreateDateColumn } from "typeorm";
import { AppUsers as AppUser } from "./AppUsers";
import { StoryCategories as StoryCategory } from './StoryCategories';
import { Stories } from './Stories';
import { Users } from './Users';
import { StoryPropNames } from './StoryPropNames';

@Entity()
export class StoryProperties {

    @Column()
    value: string;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(type => StoryPropNames, storyPropName => storyPropName.storyProperties, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true,
        primary: true
    })
    storyPropName: StoryPropNames;

    @ManyToOne(type => Stories, story => story.storyProperties, {
        primary: true
    })
    story: Stories;
}
