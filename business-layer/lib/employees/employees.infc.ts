
import { Employees as Employee, Users as User } from '../../../model-layer';

interface IEmployees {
    addEmployee(employee: User): Promise<User> ;
    getEmployees(): Promise<Employee[]>;
    findById(id: number): Promise<Employee>;
    update(employee: User): Promise<User>;
    removeById(id: number): Promise<User>;
}
export { IEmployees };


