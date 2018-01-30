interface ReturnStatus {
    message: string,
    success: boolean
}
//export { ReturnStatus };

interface Pagination {
    skip: number,
    take: number,
    order?: "ASC" | "DESC",
    sort: string
}

interface AppUserRegister {
    phoneNumber: number,
    externalAppUserId: string,
    appID: string,
    name: string
}