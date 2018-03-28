import { injectable, inject } from 'inversify';
import { Employees as Employee, Users as User, Roles as Role } from '../../../model-layer';
import { GenericRepository, QueryBuilder } from '../../../data-layer';
import { IEmployees } from './employees.infc';
import { BusinessLayerHelper } from '../helper';

@injectable()
class Employees implements IEmployees {

    constructor( @inject('GenericRepository') private repo: GenericRepository<any>,
        @inject('BusinessLayerHelper') private helper: BusinessLayerHelper,
        @inject('QueryBuilder') private knex: QueryBuilder) { }

    public async  addEmployee(addEmployee: AddEmployee): Promise<User> {
        let employees: Employee[]
        // in case of login check if there is an employee return null
        if (addEmployee.registererId === 0) {
            if (!this.hasEmployee())
                return null;
        }
        let user = new User();
        user.family = addEmployee.family;
        user.name = addEmployee.name;
        let employee = new Employee();
        if (this.hasEmployee()) {
            let registerer: Employee = await this.findById({ employeeId: addEmployee.registererId, loggedInUserId: addEmployee.registererId });
            employee.parent = registerer;
        }
        employee.email = addEmployee.email;
        employee.password = addEmployee.password;
        user.employee = employee;
        let hashedPass = this.helper.hashPassword(user.employee.password);
        user.employee.password = hashedPass.hash;
        user.employee.salt = hashedPass.salt;
        let result: User = await this.repo.save(user);
        return result;
    }

    public async hasEmployee(): Promise<boolean> {
        let repo = await this.repo.getRepository(Employee)
        let db = await repo.createQueryBuilder('employee')
            .take(1)
            .getMany();
        if (db && db.length > 0) {
            return true;

        } else if (db) {
            return false;
        }
        else {
            return true;
        }
    }

    private async getCurrentEmployeeDescendants(employeeId: number) {
        let repo = await this.repo.getTreeRepository(Employee)
        let currentEmployee: Employee = await this.repo.getSingle(Employee, {
            where: {
                "employeeId": employeeId
            }
        });
        return await repo.createDescendantsQueryBuilder('employee', 'employeeClosure', currentEmployee);
    }

    public async  getEmployees(getEmployees: GetEmployee): Promise<Employee[]> {
        let db = await this.getCurrentEmployeeDescendants(getEmployees.employeeId);
        if (getEmployees.pagination) {
            return db.innerJoinAndSelect('employee.user', 'user')
                .orderBy(getEmployees.pagination.sort, getEmployees.pagination.order)
                .skip(getEmployees.pagination.skip)
                .take(getEmployees.pagination.take)
                .getMany();
        }
        else {
            return db.getMany();
        }
    }

    public async findById(getEmployee: GetEmployeeById): Promise<Employee> {
        let db = await this.getCurrentEmployeeDescendants(getEmployee.loggedInUserId);
        return await db.
            innerJoinAndSelect('employee.user', 'user')
            .where("employee.employeeId = :employeeId", { employeeId: getEmployee.employeeId })
            .getOne();
    }

    public async update(user: UpdateEmployee): Promise<ReturnStatus> {
        try {
            let employee = await this.findById({ employeeId: user.employeeId, loggedInUserId: user.loggedInUserId });
            employee.user.family = user.family || employee.user.family;
            employee.user.name = user.name || employee.user.name;
            let savedResult = await this.repo.save(employee);
            return { success: true, message: 'done' };
        }
        catch (error) {
            return { success: false, message: error };
        }

    }

    public async  updatePassword(changePassword: ChangePassword): Promise<ReturnStatus> {
        let result = await this.findById({ employeeId: changePassword.employeeId, loggedInUserId: changePassword.loggedInUserId });
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

    public async  updateEmail(employee: UpdateEmail): Promise<ReturnStatus> {
        let result = await this.findById({ employeeId: employee.employeeId, loggedInUserId: employee.loggedInUserId });
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

    public async  removeById(deleteEmployee: DeleteEmployee): Promise<any> {

        let result = await this.findById({ employeeId: deleteEmployee.employeeId, loggedInUserId: deleteEmployee.loggedInUserId });
        if (result) {
            try {
                let knex = this.knex.getKnex();
                return knex.transaction(async (trx) => {
                    await knex('employees_closure').transacting(trx).where('descendant', result.employeeId).del();
                    await knex('roles_employees_employees').transacting(trx).where('employeesEmployeeId', result.employeeId).del();
                    await knex('employees').transacting(trx).where('employeeId', result.employeeId).del();
                    await knex('users').transacting(trx).where('userId', result.user.userId).del();
                    return { success: true, message: 'done' };
                })
            }
            catch (err) {
                console.log(err)
                throw err; //<-- pass exception so that it is thrown out from the callback

            }
        }
        else {
            return { success: false, message: 'Wrong Id' };
        }

        // let employee: Employee = await this.repo.getSingle(Employee, {
        //     where: {
        //         "employeeId": id
        //     }
        // });
        // let user: User = await this.repo.getSingle(User, {
        //     where: {
        //         "userId": 9
        //     }
        // });
        // console.log(employee);
        // console.log(user);
        // await this.repo.remove([employee,user]);
        // return { success: true, message: 'Employee deleted' };
    }

    public async  addRoleToEmployee(assignRole: AssignRole): Promise<ReturnStatus> {
        try {
            let db = await this.getCurrentEmployeeDescendants(assignRole.registererId);
            let employee: Employee = await db.
                innerJoinAndSelect('employee.user', 'user')
                .leftJoinAndSelect('employee.employeesRoles', 'roles')
                .where("employee.employeeId = :employeeId", { employeeId: assignRole.employeeId })
                .getOne();
            let role: Role = await this.repo.getSingle(Role, {
                where: {
                    "roleId": assignRole.roleId
                }
            });
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
            }
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }

    public async authenticate(username: string, password: string): Promise<any> {
        // let result: Employee = await this.repo.getSingle(Employee, {
        //     relations: ["user"],
        //     where: {
        //         "email": username
        //     }
        // });

        let db = await this.repo.getRepository(Employee);
        let result: Employee = await db.createQueryBuilder('employee').
            innerJoinAndSelect('employee.user', 'user')
            .innerJoinAndSelect('employee.employeesRoles', 'roles')
            .where("employee.email = :email", { email: username })
            .getOne();
        if (result) {
            if (this.helper.isPasswordCorrect(result.password, result.salt, password)) {
                return {
                    message: null, user: {
                        id: result.user.userId,
                        employeeId: result.employeeId,
                        firstname: result.user.name,
                        lastname: result.user.family,
                        email: result.email,
                        password: result.password,
                        verified: true,
                        roles: result.employeesRoles.map(role => {
                            return role.role
                        })
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


