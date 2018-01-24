import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { AppUsers as AppUser } from "./AppUsers";
import { StoryCategories as StoryCategory } from './StoryCategories';

@Entity()
export class Stories {

    @PrimaryGeneratedColumn()
    storyId: number;

    @Column()
    timestamp: Date;

    @ManyToOne(type => StoryCategory, storyCategory => storyCategory.stories)
    storyCategory: StoryCategory;

    @ManyToOne(type => AppUser, appUser => appUser.stories)
    creator: AppUser;
}
