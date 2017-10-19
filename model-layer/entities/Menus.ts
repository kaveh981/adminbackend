import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { EmployeeRoles } from './EmployeeRoles';

@Entity()
export class Menus {

    @PrimaryGeneratedColumn()
    menuId: number;

    @Column()
    title: string;

    @OneToMany(type => Menus, menu => menu.parentMenu)
    subMenus: Menus[];

    @ManyToOne(type => Menus, menu => menu.subMenus)
    parentMenu: Menus;

    @ManyToOne(type => EmployeeRoles, employeeRole => employeeRole.menus)
    role: EmployeeRoles;
}