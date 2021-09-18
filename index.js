// Inicios de sesión en paginas utilizadas diariamente, guarda las cookies para ser utilizadas en próximos accesos
// Falta crear base de datos para que las contraseñas y usuarios no queden expuestos en texto plano

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function loginGestion() {
	try {
		const URL = 'URL_GESTION';
		const browser = await puppeteer.launch({
            headless: true
        });
		const page = await browser.newPage();

		await page.goto(URL);

        //Login Gestion
        await page.type('#loginform-username', 'USUARIO');
        await page.type('#loginform-password', 'CONTRASEÑA');
        await page.click('#loginform-rememberme');
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        // Get cookies
        const cookies = await page.cookies();
        await fs.writeFile('./cookies-gestion.json', JSON.stringify(cookies, null, 2));

		await browser.close();
	} catch (error) {
		console.error(error);
	}
}

async function loginMesa() {
	try {
		const URL = 'URL_MESA';
		const browser = await puppeteer.launch({
            headless: true
        });
		const page = await browser.newPage();

		await page.goto(URL);

        //Login Gestion
        await page.keyboard.press('Tab');
        await page.keyboard.type('USUARIO');
        await page.keyboard.press('Tab');
        await page.keyboard.type('CONTRASEÑA');        
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        // Get cookies
        const cookies = await page.cookies();
        await fs.writeFile('./cookies-mesa.json', JSON.stringify(cookies, null, 2));

		await browser.close();
	} catch (error) {
		console.error(error);
	}
}

async function loginSmart() {
	try {
		const URL = 'URL_SMART';
		const browser = await puppeteer.launch({
            headless: true
        });
		const page = await browser.newPage();

		await page.goto(URL);

        //Login Smart Olt        
        await page.type('#identity', 'USUARIO');
        await page.type('#password', 'CONTRASEÑA');
        await page.click('#remember')        
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        // Get cookies
        const cookies = await page.cookies();
        await fs.writeFile('./cookies-smart.json', JSON.stringify(cookies, null, 2));

		await browser.close();
	} catch (error) {
		console.error(error);
	}
}

loginGestion();
loginMesa();
loginSmart();

module.exports = {
    "loginGestion": loginGestion,
    "loginMesa": loginMesa,
    "loginSmart": loginSmart
}