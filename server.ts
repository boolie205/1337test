import express, { Express, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
import { scrape } from './scraper/scraper';
import {GetAllCoworkers} from "./api/coworkers";
import {GetCoworkerById} from "./api/coworkers"
import {LoginUser} from "./api/auth";
import {IScrapedData} from "./api/interfaces";


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});


export var scrapedData : IScrapedData | string  //this is going to come from redis

//this will self invoke, and run on init
fs.exists('data.json', async (e) => {
  if (!e) {
    console.log('scraping....');
    scrapedData = JSON.stringify(await scrape(process.env.TRETTON_37_URL))
    fs.writeFile('data.json', scrapedData.toString(), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  } else {
    console.log('data file already exists, Api ready to use');
    scrapedData = JSON.parse(fs.readFileSync('data.json').toString());
  }
})

app.get('/api/coworkers',LoginUser,GetAllCoworkers);
app.get('/api/coworker/:id',LoginUser,GetCoworkerById);
app.post('/api/login', LoginUser);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})
