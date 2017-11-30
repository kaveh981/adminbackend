'use strict';

import * as test from 'tape';
import { APIRequestHandler, container, DataPopulator } from '../../lib/exporter';
import { injectable, inject } from 'inversify';
import { Payload } from '../../../lib/exporter';
import { Menus } from '../../../model-layer';


const dataPopulator = container.get<DataPopulator>('DataPopulator');
const apiRequest = container.get<APIRequestHandler>('APIRequestHandler');
/** Test constants */
const route = 'menus';



export async function MT_API_MENU_GET_MAIN_01(assert: test.Test) {
    /** Setup */
    assert.plan(1);
    let menu = await dataPopulator.createMenu(true);
    let menu2 = await dataPopulator.createMenu(true);
    let responseNoOptional = await apiRequest.get(route);
    assert.deepEqual(responseNoOptional.body, [menu, menu2]);
}

export async function MT_API_MENU_GET_SUB_05(assert: test.Test) {
    /** Setup */
    assert.plan(1);
    let menu = await dataPopulator.createMenu(false);
    let responseNoOptional = await apiRequest.get(route + `/${menu.parent.menuId}`, {});
    assert.deepEqual(responseNoOptional.body, [menu]);
}

export async function MT_API_MENU_ADD_02(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let menu = new Menus();
    menu.title = 'someTitle';
    /** Test */
    let response = await apiRequest.post(route, { 'title': menu.title });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { 'title': menu.title, 'menuId': 1 });
}

export async function MT_API_MENU_UPDATE_03(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let menu = await dataPopulator.createMenu(true);
    menu.title = 'someNewTitle';
    /** Test */
    let response = await apiRequest.put(route, menu);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, menu);
}

export async function MT_API_MENU_DELETE_04(assert: test.Test) {
    /** Setup */
    assert.plan(2);
    let menu = await dataPopulator.createMenu(false);
    let menuId = menu.menuId;
    console.log('created menu: ' + JSON.stringify(menu));
    /** Test */
    let response = await apiRequest.delete(route + `/${menu.menuId}`, {});
    assert.equal(response.status, 200);
    let deletedMenu = await dataPopulator.getMenuById(menuId);
    assert.equal(deletedMenu, undefined);
}
