export interface IScrapedData {
    data: IData[]
}


interface IData{
    id: number,
    name: string,
    city:string,
    country: string,
    text:string,
    imagePortraitUrl:string,
    imageFullUrl:string,
}
