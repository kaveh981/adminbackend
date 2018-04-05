interface GetRoles {
    registererId: number,
    employeeId: number
}

interface AddRole {
    registererId: number,
    role: string
}

interface RoleForAutocomplete {
    registererId: number,
    role: string
}
