import {ClosureEntity, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn} from "typeorm";

@ClosureEntity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @TreeChildren()
    children: Category;

    @TreeParent()
    parent: Category;

    @TreeLevelColumn()
    level: number;
}