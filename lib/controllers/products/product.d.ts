interface AddProductCategory {
    categoryId?:number,
    creatorId: number,
    category: string,
    status: Status,
    parentCategoryId?: number
}

interface GetCategory {
    status: Status,
    parentCategoryId?: number
}