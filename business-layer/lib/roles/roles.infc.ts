
import { Roles as Role } from '../../../model-layer';

interface IRoles {
    addRole(role: AddRole): Promise<Role>;
    getEmployeeRoles(getRoles: GetRoles): Promise<EmployeeRoles[]>;
    findById(id: number): Promise<Role>;
    update(role: Role): Promise<Role>;
    removeById(id: number): Promise<Role>;
    getRoleByName(role: string, take: number): Promise<RoleForAutocomplete[]>
    getAllRoles(pagination?: Pagination): Promise<RoleForAutocomplete[]>
}
export { IRoles };


