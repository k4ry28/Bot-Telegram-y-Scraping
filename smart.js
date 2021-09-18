//Saca captura a la informacion de la ONU de cliente FTTH (estado, NAP y precinto). Esta captura sera devuelta por el bot de telegram.

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const cliente = 2346;

async function getSmartCap(cliente) {
    try {
        let URL = 'URL_SMART' + cliente + 'FILTRO_BUSQUEDA';

        const browser = await puppeteer.launch({
            headless: true
        }); 

        const page = await browser.newPage();

        await page.setViewport({
            width: 1000,
            height: 370,
        });

        // Login Smart:
        await page.goto('URL_SMART');
        await page.type('#identity', 'USUARIO');
        await page.type('#password', 'CONTRASEÑA');
        await page.click('#remember')        
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        await page.goto(URL);
        
        var link = await page.evaluate((cliente) => {
            let td = document.getElementsByTagName('td');
            let posicion = 2, text;

            for (var i = 0; i < td.length; i++) {
                if (i == posicion) {
                    // Split client number and client name
                    text = td[i].innerText.split('-');

                    // Search for exact match:
                    if (text[0].trim() == cliente || text[1].trim() == cliente) {
                        let a = td[i - 1].getElementsByTagName('a');

                        return a[0].getAttribute('href');
                    }
                    // If there´s more than one match: **Example number searched= 123, matches: 4123, 123, 1234
                    posicion += 14;
                }
            }
        }, cliente);     

        await page.goto(link);
        
        // Takes a screenshot of the client ONU information:
        await page.screenshot({
            path: `./${cliente}.png`,
        })

        await browser.close();

    } catch (error) {
        console.error(error);
    }
}

getSmartCap(cliente);