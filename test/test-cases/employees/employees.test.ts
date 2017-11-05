'use strict';

import * as test from 'tape';
import { APIRequestHandler, container, DataPopulator } from '../../lib/exporter';
import { injectable, inject } from 'inversify';
import { Payload } from '../../../lib/exporter';
import { Employees, Users } from '../../../model-layer';


const dataPopulator = container.get<DataPopulator>('DataPopulator');
const apiRequest = container.get<APIRequestHandler>('APIRequestHandler');
/** Test constants */
const route = 'employees';



export async function MT_API_EMPLOYEE_GET_01(assert: test.Test) {
    /** Setup */
    assert.plan(1);
    let user = await dataPopulator.createEmployee();
    let responseNoOptional = await apiRequest.get(route);
    assert.deepEqual(responseNoOptional.body, [{ name: user.name, family: user.family, email: user.employee.email, employeeId: user.userId }]);
}

export async function MT_API_EMPLOYEE_GET_BYID_05(assert: test.Test) {
    /** Setup */
    assert.plan(1);
    let user = await dataPopulator.createEmployee();
    let responseNoOptional = await apiRequest.get(route + `/${user.userId}`, {});
    assert.deepEqual(responseNoOptional.body, { name: user.name, family: user.family, email: user.employee.email, employeeId: user.userId });
}

export async function MT_API_EMPLOYEE_ADD_02(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let user = new Users();
    user.family = 'family';
    user.name = 'name';
    let employee = new Employees();
    employee.email = 'employee@company.com';
    user.employee = employee;
    /** Test */
    let response = await apiRequest.post(route, { 'name': user.name, 'family': user.family, 'email': user.employee.email });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { 'name': user.name, 'family': user.family, 'email': user.employee.email, "employeeId": 1 });
}

export async function MT_API_EMPLOYEE_UPDATE_03(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let user = await dataPopulator.createEmployee();
    user.family = 'family';
    user.name = 'name';
    user.employee.email = 'employee@company.com';
    /** Test */
    let response = await apiRequest.put(route, user);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { 'name': user.name, 'family': user.family, 'email': user.employee.email, "employeeId": 1 });
}

export async function MT_API_EMPLOYEE_DELETE_04(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let user = await dataPopulator.createEmployee();
    let userId= user.userId;
    /** Test */
    let response = await apiRequest.delete(route + `/${user.userId}`, {});
    assert.equal(response.status, 200);
    let deletedUser = await dataPopulator.getUserById(userId);
    assert.equal(deletedUser,undefined);
}
