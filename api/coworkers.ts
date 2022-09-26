import {Request, Response} from "express";
import {IScrapedData} from "./interfaces";
import {scrapedData} from "../server";

export const GetAllCoworkers = (req: Request, res: Response) : void  =>{
    const filter = req.query.filter as string;
    const start = parseInt(req.query.start as string);
    const end = parseInt(req.query.end as string);
    const filledData = scrapedData as IScrapedData;
    const data = filter ? filledData.data.filter(x => x.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) : filledData.data;

    if(req.query.start && req.query.end) {
        const slicedData = data.slice(start, end);
        res.json({
            data: slicedData,
            totalLength: filledData.data.length
        });
    } else {
        res.json({
            data: data,
            totalLength: data.length
        });
    }
}


export const GetCoworkerById = (req : Request, res: Response) : void =>{
    const filledData = scrapedData as IScrapedData;
    const reqId = parseInt(req.params["id"]);
    const coworker = filledData.data.find((x) => x.id == reqId);
    res.json({
        id: coworker.id,
        name: coworker.name,
        text: coworker.text,
        imagePortraitUrl: coworker.imagePortraitUrl
    });
}
