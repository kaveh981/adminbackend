

import { injectable, inject } from 'inversify';
import { Roles as Role, Employees as Employee } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IRoles } from './roles.infc';


@injectable()
class Roles implements IRoles {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>) { }

    public async  addRole(role: AddRole): Promise<Role> {
        let employee: Employee = await this.repo.getSingle(Employee, {
            where: {
                "employeeId": role.registererId
            }
        });
        let newRole = new Role();
        newRole.role = role.role;
        newRole.employees = [employee];
        let result: Role = await this.repo.save(newRole);
        return result;
    }

    public async  addRoleToEmployee(assignRole: AssignRole): Promise<ReturnStatus> {
        try {
            let repo = await this.repo.getTreeRepository(Employee)
            let currentEmployee: Employee = await repo.createQueryBuilder()
                .leftJoinAndSelect('employee.employeesRoles', 'roles')
                .where("employee.employeeId = :employeeId", { employeeId: assignRole.registererId })
                .getOne();
            let db = await repo.createDescendantsQueryBuilder('employee', 'employeeClosure', currentEmployee);
            let employee: Employee = await db.
                innerJoinAndSelect('employee.user', 'user')
                .leftJoinAndSelect('employee.employeesRoles', 'roles')
                .where("employee.employeeId = :employeeId", { employeeId: assignRole.employeeId })
                .getOne();
            let role: Role = currentEmployee.employeesRoles.filter(newRole => {
                newRole.roleId === assignRole.roleId;
            })[0];
            if (employee && role) {
                if (assignRole.checked) {
                    employee.employeesRoles.push(role);
                } else {
                    let filteredRoles = employee.employeesRoles.filter(el => {
                        return el.roleId !== role.roleId;
                    });
                    employee.employeesRoles = filteredRoles;
                }
                await this.repo.save(employee);
                return { success: true, message: 'done' };
            } else if(!employee){
                 return { success: false, message: `employee isn't a descendant of the current employee` };
            } else if(!role){
                 return { success: false, message: `Role isn't among the currenty employee roles` };
            } else {
                 return { success: false, message: `Something wrong` };
            }
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }

    public async  findById(id: number): Promise<Role> {
        let result: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": id
            }
        });
        return result;
    }

    private async getRoles(getRoles: GetRoles): Promise<Role[]> {
        let repo = await this.repo.getRepository(Role)
        let role = new Role();
        return await repo.createQueryBuilder('roles')
            .innerJoinAndSelect("roles.employees", "employees")
            .where("employees.employeeId = :employeeId", { employeeId: getRoles.registererId })
            .getMany();
    }

    public async getEmployeeRoles(getRoles: GetRoles): Promise<EmployeeRoles[]> {
        if (getRoles.employeeId === 0)
            getRoles.employeeId = getRoles.registererId;
        let registererRoles = await this.getRoles(getRoles);
        let repo = await this.repo.getRepository(Role)
        let employeeRoles = await repo.createQueryBuilder('roles')
            .innerJoinAndSelect("roles.employees", "employees")
            .where("employees.employeeId = :employeeId", { employeeId: getRoles.employeeId })
            .getMany();
        let assignedRoles: EmployeeRoles[] = []
        registererRoles.forEach(role => {
            if (employeeRoles.some(vendor => vendor['roleId'] === role.roleId)) {
                assignedRoles.push({ role: role.role, roleId: role.roleId, checked: true })
            } else {
                assignedRoles.push({ role: role.role, roleId: role.roleId, checked: false })
            }
        })
        return assignedRoles;
    }

    public async  update(role: Role): Promise<Role> {
        console.log(role);
        let result: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": role.roleId
            }
        });
        result.role = role.role
        await this.repo.save(result);
        return result;
    }

    public async  removeById(id: number): Promise<Role> {
        let result: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": id
            }
        });
        await this.repo.remove([result]);
        return result;
    }
}
export { Roles };


