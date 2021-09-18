/**
 * El técnico envia numero de ticket con el comando /inicio_nroTicket
 * Entra en mesa, busca tk, saca categoria, numero y nombre cliente y link de la pagina de mesa y lo envia al chat con formato:
 * Numero de Ticket - Categoria del Ticket
 * Numero de cliente - Nombre de cliente
 * Link de mesa
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function inicio(numeroTk) {
    try {

        let URL = 'URL_MESA' + numeroTk;

        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();

        // Read JSON with cookies
        const cookiesString = await fs.readFile('./cookies-mesa.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);

        // Search for open ticket:
        await page.goto(URL);

        var ticket = await page.evaluate(() => {
            var datos = {};

            // Get cells from table:
            let table = document.getElementsByTagName('td');
            let cantidad = document.getElementById('total');

            // No open tk
            if (cantidad.innerText.startsWith('0')) {
                datos.cantidad = 0;
                console.log('No hay tk');

                return datos;
            }
            else {
                // One open tk
                datos.cantidad = 1;

                for (let i = 0; i < table.length; i++) {

                    if (i == 1) {
                        // Link:
                        let a = table[i].getElementsByTagName('a');
                        datos.link = 'URL_MESA' + a[0].getAttribute('href');
                    }

                    if (i == 5) {
                        // Client number:
                        var numeroC = table[i].innerText;
                    }

                    if (i == 6) {
                        // Client name:
                        var nombreC = table[i].innerText;
                    }

                    if (i == 9) {
                        // Category:
                        datos.categoria = table[i].innerText;
                    }
                }

                if (datos.cantidad == 1) {
                    datos.cliente = numeroC + ' - ' + nombreC;
                }

                return datos;
            }
        })

        ticket.numero = numeroTk;

        await browser.close();

        return ticket;

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    "inicio": inicio
}
