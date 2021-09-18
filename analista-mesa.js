// Devuelve el comentario que los analistas hacen del caso. Tareas especificas a realizar para solucionar el problema que detectan en el cliente.

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
var tk = NRO_TICKET;

async function comentario(tk) {
    try {
        var URL = 'URL_MESA' + String(tk);

        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();

        // Read JSON with cookies
        const cookiesString = await fs.readFile('./cookies-mesa.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);

        await page.goto(URL);
        await page.mouse.wheel({ deltaY: 1500 });
        await page.waitForTimeout(1000);

        let coment = await page.evaluate(() => {
            let td = document.getElementsByTagName('td')
            let analistas = ['NOMBRES DE ANALISTAS'];
            var a;

            for (var i = 0; i < td.length; i++) {
                for (var j = 0; j < analistas.length; j++) {
                    if (td[i].innerText == analistas[j]) {
                        a = 'Analista: ' + td[i + 2].innerText;
                        console.log(a);                        
                    }
                }
                return a.slice(0, a.indexOf('\n\n'));
            }            
        });
        console.log('');
        console.log(coment);
        console.log('');

        //await page.waitForTimeout(5000);
        await browser.close();

    } catch (error) {
        console.error(error);
    }
}

comentario(tk);

module.exports = {
    "comentario" : comentario
}