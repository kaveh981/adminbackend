import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, JoinTable, ManyToOne, ManyToMany, CreateDateColumn } from "typeorm";
import { Users } from "./Users";
import { StoryCategories as StoryCategory } from './StoryCategories';
import { StoryProperties } from './StoryProperties';

@Entity()
export class Stories {

    @PrimaryGeneratedColumn()
    storyId: number;

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    time: Date;

    @Column()
    capacity: number;

    @Column()
    status: Status;

    @Column()
    price: number;

    @ManyToOne(type => StoryCategory, storyCategory => storyCategory.stories, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    storyCategory: StoryCategory;

    @ManyToOne(type => Users, user => user.stories, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    creator: Users;

    @OneToMany(type => StoryProperties, storyProperty => storyProperty.story, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    storyProperties: StoryProperties[];
}

