import puppeteer from 'puppeteer';
import {IEmployee, IEmployeeData} from './interfaces';

export const scrape = async (baseUrl) =>{
    const browser = await puppeteer.launch( { args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(baseUrl + 'meet');
    const data = await getEmployeeData(page);

    const employeeData : IEmployeeData  = {
        data: [],
        totalLength: 0
    };

    for(const [name, employee] of Object.entries(data)) {
        // @ts-ignore
        await page.goto(`${baseUrl}${employee.extraData}`);
        const employeeExtraData = await getExtraEmployeeData(page);

        employeeData.data.push({
            // @ts-ignore
            id: employee.id,
            name: name,
            // @ts-ignore
            city: employee.location.city,
            // @ts-ignore
            country: employee.location.country,
            text: employeeExtraData.text.join("\n"),
            // @ts-ignore
            imagePortraitUrl: employee.portraitImage,
            imageFullUrl: employeeExtraData.image
            } as IEmployee );
        employeeData.totalLength++;
    }

    await browser.close();

    return new Promise((resolve, reject) => {
        resolve(employeeData);
    });
}

const getExtraEmployeeData = async (page) => {
    await page.waitForSelector('.main-ninja-text');
    await page.waitForSelector('image');

    return await page.evaluate(() => {
        const data = {
            text: []
        };
        if(document){
            const mainTextElements = document.querySelector('.main-ninja-text').querySelectorAll('p');
            for(const element of mainTextElements) {
                data["text"].push(element.innerHTML);
            }
    
        data["image"] = document.querySelector('image').getAttribute('xlink:href');
    
            return data;
        }
    
    });
};

const getEmployeeData = async (page) =>{
    return await page.evaluate(() => {
        const data = {};
        const elements = document.getElementsByClassName('ninja-summary');
        let i = 0;
        for (const element of elements) {

            const employeeHref: HTMLAnchorElement | null | undefined = element.querySelector('a');
            const additionalHref: string | null | undefined = employeeHref?.getAttribute('href');
            const nameData: string | null | undefined = employeeHref?.innerHTML.replace(new RegExp("<span>.*</span>"), "");
            const locationData: Array<string> | null | undefined = employeeHref.querySelector('span').innerHTML.split(' ');
            const country: string | null | undefined = locationData[0];
            const city: string | null | undefined = locationData.slice(1).join(' ');
            // @ts-ignore
            const portraitImage: HTMLImageElement | null | undefined = element.querySelector('img.portrait').src;

            data[nameData] = {
                extraData: additionalHref,
                id: ++i,
                location: {
                    country: country,
                    city: city
                },
                portraitImage: portraitImage
            };
        }
        return data;
    });

}

module.exports = {
    scrape
}
