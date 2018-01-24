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