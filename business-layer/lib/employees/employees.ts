import { injectable, inject } from 'inversify';
import { Employees as Employee, Users as User, Roles as Role } from '../../../model-layer';
import { GenericRepository } from '../../../data-layer';
import { IEmployees, ChangePassword } from './employees.infc';
import { BusinessLayerHelper } from '../helper';


@injectable()
class Employees implements IEmployees {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>,
        @inject('BusinessLayerHelper') private helper: BusinessLayerHelper) { }

    public async  addEmployee(user: User): Promise<User> {
        let hashedPass = this.helper.hashPassword(user.employee.password);
        user.employee.password = hashedPass.hash;
        user.employee.salt = hashedPass.salt;
        let result: User = await this.repo.save(user);
        return result;
    }

    public async  getEmployees(): Promise<Employee[]> {
        let result: Employee[] = await this.repo.list(Employee, { relations: ['user'] });
        return result;
    }

    public async  findById(id: number): Promise<Employee> {
        let result: Employee = await this.repo.getSingle(Employee, {
            relations: ["user"],
            where: {
                "userUserId": id
            }
        });
        return result;
    }

    public async  update(user: User): Promise<User> {
        let result: User = await this.repo.getSingle(User, {
            relations: ["employee"],
            where: {
                "userId": user.userId
            }
        });
        result.family = user.family || result.family;
        result.name = user.name || result.name;
        let savedResult = await this.repo.save(result);
        return savedResult;
    }

    public async  updatePassword(changePassword: ChangePassword): Promise<ReturnStatus> {
        let result: Employee = await this.repo.getSingle(Employee, {
            where: {
                "employeeId": changePassword.id
            }
        });
        if (result) {
            if (this.helper.isPasswordCorrect(result.password, result.salt, changePassword.oldPassword)) {
                let hashedPass = this.helper.hashPassword(changePassword.newPassword);
                result.password = hashedPass.hash || result.password;
                result.salt = hashedPass.salt || result.salt;
                let savedResult = await this.repo.save(result);
                return { success: true, message: 'done' };
            } else {
                return { success: false, message: 'Wrong Password' };
            }

        } else {
            return { success: false, message: 'Wrong Id' };
        }
    }

    public async  updateEmail(employee: Employee): Promise<ReturnStatus> {
        let result: Employee = await this.repo.getSingle(Employee, {
            where: {
                "employeeId": employee.employeeId
            }
        });
        if (result) {
            if (this.helper.isPasswordCorrect(result.password, result.salt, employee.password)) {
                result.email = employee.email || result.email;
                let savedResult = await this.repo.save(result);
                return { success: true, message: 'done' };
            } else {
                return { success: false, message: 'Wrong Password' };
            }

        } else {
            return { success: false, message: 'Wrong Id' };
        }
    }

    public async  removeById(id: number): Promise<any> {
        let user: User = await this.repo.getSingle(User, {
            where: {
                "userId": id
            }
        });
        let employee: Employee = await this.repo.getSingle(Employee, {
            where: {
                "userUserId": id
            }
        });
        await this.repo.remove([employee, user]);
        return { success: true, message: 'Employee deleted' };
    }

    public async  addRoleToEmployee(employeeId: number, roleId: number): Promise<User> {
        let employee: Employee = await this.repo.getSingle(Employee, {
            where: {
                "userUserId": employeeId
            }
        });
        let role: Role = await this.repo.getSingle(Role, {
            where: {
                "roleId": roleId
            }
        });
        employee.employeesRoles.push(role);
        let savedResult = await this.repo.save(employee);

        return savedResult;
    }

    public async authenticate(username: string, password: string): Promise<any> {
        let result: Employee = await this.repo.getSingle(Employee, {
            relations: ["user"],
            where: {
                "email": username
            }
        });
        if (result) {
            if (this.helper.isPasswordCorrect(result.password, result.salt, password)) {
                return {
                    message: null, user: {
                        id: result.user.userId,
                        firstname: result.user.name,
                        lastname: result.user.family,
                        email: result.email,
                        password: result.password,
                        verified: true
                    }
                };
            } else {
                return { message: 'wrong password', user: null };
            }

        } else {
            return {
                message: 'wrone username', user: null
            };
        }
    }
}
export { Employees };


