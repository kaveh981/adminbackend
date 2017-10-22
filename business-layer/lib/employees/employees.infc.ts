
import { Employees as Employee } from '../../../model-layer';

interface IEmployees {
    getEmployees(): Promise<Employee[]>;
    findById(id: number): Promise<Employee>;
    update(employee: Employee): Promise<Employee>;
    removeById(id: number): Promise<Employee>;
    findByUsername(username: string): Promise<Employee>;
}
export { IEmployees };


