'use strict';

import * as test from 'tape';
import { APIRequestHandler, container, DataPopulator } from '../../lib/exporter';
import { injectable, inject } from 'inversify';
import { Payload } from '../../../lib/exporter';
import { Roles } from '../../../model-layer';


const dataPopulator = container.get<DataPopulator>('DataPopulator');
const apiRequest = container.get<APIRequestHandler>('APIRequestHandler');
/** Test constants */
const route = 'roles';



export async function MT_API_ROLE_GET_01(assert: test.Test) {
    /** Setup */
    assert.plan(1);
    let role = await dataPopulator.createRole();
    let responseNoOptional = await apiRequest.get(route);
    assert.deepEqual(responseNoOptional.body, [role]);
}

export async function MT_API_ROLE_GET_BYID_05(assert: test.Test) {
    /** Setup */
    assert.plan(1);
    let role = await dataPopulator.createRole();
    let responseNoOptional = await apiRequest.get(route + `/${role.roleId}`, {});
    assert.deepEqual(responseNoOptional.body, role);
}

export async function MT_API_ROLE_ADD_02(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let role = new Roles();
    role.role = 'someRole';
    /** Test */
    let response = await apiRequest.post(route, { 'role': role.role });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { 'role': role.role, 'roleId': 1 });
}

export async function MT_API_ROLE_UPDATE_03(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let role = await dataPopulator.createRole();
    role.role = 'someNewRole';
    /** Test */
    let response = await apiRequest.put(route, role);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, role);
}

export async function MT_API_ROLE_DELETE_04(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let role = await dataPopulator.createRole();
    let roleId = role.roleId;
    /** Test */
    let response = await apiRequest.delete(route + `/${role.roleId}`, {});
    assert.equal(response.status, 200);
    let deletedRole = await dataPopulator.getRoleById(roleId);
    assert.equal(deletedRole, undefined);
}
