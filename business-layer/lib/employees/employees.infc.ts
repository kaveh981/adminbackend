
import { Employees as Employee, Users as User } from '../../../model-layer';

interface IEmployees {
    addEmployee(employee: AddEmployee): Promise<User>;
    getEmployees(getEmployee: GetEmployee): Promise<Employee[]>;
    findById(getEmployee: GetEmployeeById): Promise<Employee>;
    update(employee: UpdateEmployee): Promise<ReturnStatus>;
    updatePassword(changePassword: ChangePassword): Promise<ReturnStatus>;
    updateEmail(employee: UpdateEmail): Promise<ReturnStatus>
    removeById(deleteEmployee: DeleteEmployee): Promise<User>;
    authenticate(username: string, password: string): Promise<any>;
    addRoleToEmployee(role: AssignRole): Promise<ReturnStatus>;
}
export { IEmployees };






