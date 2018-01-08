
import { Employees as Employee, Users as User } from '../../../model-layer';

interface ChangePassword {
    id: number,
    oldPassword: string,
    newPassword: string
}
export { ChangePassword };

interface IEmployees {
    addEmployee(employee: User): Promise<User>;
    getEmployees(): Promise<Employee[]>;
    findById(id: number): Promise<Employee>;
    update(employee: User): Promise<User>;
    updatePassword(changePassword: ChangePassword): Promise<ReturnStatus>
    updateEmail(employee: Employee): Promise<ReturnStatus>
    removeById(id: number): Promise<User>;
    authenticate(username: string, password: string): Promise<any>
}
export { IEmployees };






