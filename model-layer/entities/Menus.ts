import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Roles } from './Roles';

@Entity()
export class Menus {

    @PrimaryGeneratedColumn()
    menuId: number;

    @Column()
    title: string;

    @OneToMany(type => Menus, menu => menu.parent)
    subMenus: Menus[];

    @ManyToOne(type => Menus, menu => menu.subMenus)
    parent: Menus;

    @ManyToOne(type => Roles, role => role.menus)
    role: Roles;
}