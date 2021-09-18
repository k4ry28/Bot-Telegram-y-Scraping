/**
 * Bot para agilizar tareas del soporte:
 * Realiza scraping de las paginas utilizadas diariamente de la empresa para sacar info de cliente o ticket en curso
 * 
 * Creados hasta el momento:
 *      /inicio_numeroTicket : ayuda a estandarizar el inicio de cada ticket en telegram evitando errores de tipeo
 *      /app_numeroCliente : devuelve si el cliente tiene o no la app de la empresa instalada en el telefono
 * 
 * Faltan crear o modificar:
 *      /inicio_numeroTicket : modificar para que en caso de que sea un ticket de servicio tecnico devuelva el comentario de los analistas
 *      /ayuda : devuelve todos los comando disponibles y su formato
 *      /smart_numeroCliente : devuelve informacion de la ONU de un cliente FTTH (cliente, NAP, precinto, potencia, etc)
 */

const { Telegraf } = require('telegraf');

const tk = require('./inicio_ticket');
const gestion = require('./gestion');

const token = 'TOKEN';

const bot = new Telegraf(token);

bot.start(ctx => {
    ctx.reply('Bienvenido!');
})

bot.on('text', ctx => {
    var texto = ctx.message.text;

    try {

        if (texto.startsWith('/inicio_')) {
            texto = Number(texto.slice(8, texto.length));

            tk.inicio(texto).then((ticket) => {
                if (ticket.cantidad == 1) {
                    ctx.reply(
                        'TK: ' + ticket.numero + ' - ' + ticket.categoria + '\n'
                        + 'Cliente: ' + ticket.cliente + '\n'
                        + 'Link: ' + ticket.link
                    );
                } else {
                    ctx.reply('El numero no corresponde a un ticket en curso')
                }
            });
        }

        else if (texto.startsWith('/app_')) {
            texto = Number(texto.slice(5, texto.length));            
            var flag = 1;

            gestion.getCliente(texto, flag).then((app) => {
                ctx.reply(app);
            })
        }

        else {
            ctx.reply('Comando no valido');
        }

    } catch (error) {
        console.error(error);
    }
})

bot.launch();