
export interface IEmployee {
    id: number,
    name: string,
    city: string,
    country: string,
    text: string,
    imagePortraitUrl: string,
    imageFullUrl: string
}


export interface IEmployeeData {
    data: Array<Object>,
    totalLength: number
}
