
import { Roles as Role } from '../../../model-layer';

interface IRoles {
    addRole(role: Role): Promise<Role>;
    getRoles(): Promise<Role[]>;
    findById(id: number): Promise<Role>;
    update(role: Role): Promise<Role>;
    removeById(id: number): Promise<Role>;
    findByUsername(role: string): Promise<Role>;
}
export { IRoles };


