import { Employees,Users } from '../model-layer';

export module Payload {
   
    export function getEmployee(e: Employees) {
        return {
            name: e.user.name, family: e.user.family, email: e.email, employeeId: e.user.userId
        }
    };

     export function addEmployee(user: Users) {
        return {
            name: user.name, family: user.family, email: user.employee.email, employeeId: user.userId
        }
    };
}