import * as jwt from 'jsonwebtoken';
import {Request,Response} from "express";

export const LoginUser = async (req : Request, res : Response,  next) =>{
    if(req.headers.authorization) {
        await jwt.verify(req.headers.authorization.substring(7), process.env.SECRET, (err) =>{
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
           return next();
        });
    }

    if(req.body.username) {
        let token = await jwt.sign({username: req.body.username}, process.env.SECRET);
        return res.send(token);
    }

}
