interface AddEmployee {
    registererId: number;
    family: string;
    name: string;
    email: string;
    password: string;
}

interface UpdateEmployee {
    family: string,
    name: string,
    employeeId: number,
    loggedInUserId: number,
}

interface AssignRole {
    registererId: number,
    employeeId: number,
    roleId: number,
    checked: boolean
}

interface GetEmployee {
    employeeId: number,
    pagination?: Pagination
}

interface GetEmployeeById {
    employeeId: number,
    loggedInUserId: number
}

interface ChangePassword {
    loggedInUserId: number;
    employeeId: number;
    oldPassword: string;
    newPassword: string;
}

interface UpdateEmail {
    password: string,
    email: string,
    employeeId: number,
    loggedInUserId: number,
}
interface DeleteEmployee {
    employeeId: number,
    loggedInUserId: number,
}

interface EmployeeRoles {
    roleId: number;
    role: string;
    checked: boolean;
}