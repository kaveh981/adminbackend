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

interface AddStory {
    creatorId: number,
    name: string,
    description: string,
    location?: string,
    time: Date,
    capacity: number,
    price: number
    properties?: [{ propertyId?: number, property: string, value: string }]
}

interface AddPropertyName {
    propertyName: string,
    creatorId: number,
    status: Status
}

interface AddProperty {
    storyId: number,
    propertyNameId: number,
    value: string
}

declare const enum Status {
    active = 0,
    inactive,
    deleted
}

