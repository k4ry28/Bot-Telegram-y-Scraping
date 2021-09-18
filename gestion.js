// Devuelve el link del contrato del cliente o si tiene o no la app instalada

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function getCliente(cliente, flag) {

    try {
        var URL = 'URL_GESTION' + cliente + '&id=';
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();

        //Read JSON with cookies
        const cookiesString = await fs.readFile('./cookies-gestion.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);

        // Request client ID
        await page.goto(URL);

        //Get the client link
        let link_cliente = await page.evaluate(() => {
            var pre = document.getElementsByTagName('pre');
            var id = pre[0].innerText;
            return ('URL_GESTION' + id.slice(19, id.indexOf('\"\,\"')));
        });

        await page.goto(link_cliente);

        // Get de client contract link
        if (flag == 0) {
            let link_contrato = await page.evaluate(() => {
                let td = document.getElementsByTagName('td');
                let estados = ['Normal', 'Forzada', 'Cortado'];
                var b;

                for (var i = 0; i < td.length; i++) {
                    for (var j = 0; j < estados.length; j++) {
                        if (td[i].innerText == estados[j]) {
                            b = i - 2;
                        }
                    }
                }
                let id = td[b].innerText;

                return ('URL_GESTION' + id);
            })

            await browser.close();
            return link_contrato;
        }

        // Get info about app - Installed or not?
        else if (flag == 1) {
            let app = await page.evaluate(() => {
                var tr = document.getElementsByTagName('tr');
                var a = tr.length - 3;

                // Tiene app:
                if (tr[a].innerText.startsWith('Ú')) {  // Celda donde se define ultimo uso, si no tiene no existira esta fila
                    let texto = tr[a].innerText;

                    return ('Tiene app instalada' + '\n' + 'Último uso: ' + texto.slice(29, 39));
                }

                // No tiene app:
                return ('No tiene app')
            })

            await browser.close();
            return app;
        }

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    "getCliente": getCliente
}