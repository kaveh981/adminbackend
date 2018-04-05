interface GetRoles {
    registererId: number,
    employeeId: number
}

interface AddRoute {
    registererId: number,
    route: string,
    method: Method,
    roleId?: number
}

interface UpdateRoute {
    route: string,
    method: Method,
    roleId: number,
    routeId: number
}

declare const enum Method {
    post = 0,
    get,
    put,
    delete
}
