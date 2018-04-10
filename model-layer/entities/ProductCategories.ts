import {
    ClosureEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, TreeChildren, TreeParent,
    TreeLevelColumn, ManyToOne, ManyToMany, OneToMany, JoinColumn
} from "typeorm";
import { Employees } from "./Employees";
import { Roles } from './Roles';
import { Stories as Story } from './Stories';
import { StoryPropNames as StoryPropName } from './StoryPropNames'

@ClosureEntity()
export class ProductCategories {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    status: Status;

    @TreeChildren({ cascadeInsert: true, cascadeUpdate: true})
    children: ProductCategories[];

    @TreeParent()
    parent: ProductCategories;

    @TreeLevelColumn()
    level: number;

    @ManyToOne(type => Employees, employees => employees.productCategories, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    creator: Employees;

}
