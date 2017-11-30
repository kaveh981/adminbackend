import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Roles } from './Roles';

@Entity()
export class Menus {

    @PrimaryGeneratedColumn()
    menuId: number;

    @Column()
    title: string;

    @OneToMany(type => Menus, menu => menu.parent, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    subMenus: Menus[];

    @ManyToOne(type => Menus, menu => menu.subMenus, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    parent: Menus;

    @ManyToOne(type => Roles, role => role.menus)
    role: Roles;
}