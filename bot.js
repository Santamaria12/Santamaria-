const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot está listo!');
});

const ownerNumber = '+50581261007';
const registeredUsers = new Set();
const userRanks = new Map();
const itemsForSale = {
    waifus: ['Nami', 'Hinata', 'Bulma', 'Sakura', 'Mikasa', 'Asuna', 'Rem', 'Emilia', 'Zero Two', 'Nezuko', 'Erza', 'Yoruichi', 'Kurisu', 'Saber', 'Rias', 'Akeno', 'Tsunade', 'Kaguya', 'Mai', 'Megumin', 'Alice', 'Miko', 'Tatsumaki', 'Shinobu', 'Akatsuki'],
    cars: ['Toyota', 'Honda', 'BMW'],
    houses: ['Casa en la playa', 'Apartamento en la ciudad'],
    businesses: ['Restaurante', 'Tienda de ropa']
};

const riddles = [
    "Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.",
    "Oro parece, plata no es. Quien no lo adivine, bien tonto es.",
    "Tengo agujas y no sé coser, tengo números y no sé leer.",
    "Vuelo sin alas, lloro sin ojos.",
    "Largo, largo como un camino, pero cabe en un rincón.",
    "Tiene dientes y no come, tiene cabeza y no es hombre.",
    "No es cama ni es león y desaparece en cualquier rincón.",
    "Cien amigos tengo, todos en una tabla, si no los ordeno, no me sirven para nada.",
    "No es un león, pero tiene melena, no es un libro, pero tiene hojas.",
    "Va por el cielo y no tiene alas, va por el mar y no tiene agua.",
    "Tiene ojos y no ve, tiene agua y no bebe.",
    "Tiene patas y no anda, tiene plumas y no vuela.",
    "Tiene orejas y no oye, tiene cola y no es perro.",
    "Tiene dientes y no come, tiene barba y no es hombre.",
    "Tiene hojas y no es árbol, tiene tinta y no es calamar.",
    "Tiene llaves y no es cerrajero, tiene letras y no es escritor.",
    "Tiene cara y no es persona, tiene manos y no es humano.",
    "Tiene pies y no anda, tiene manos y no agarra.",
    "Tiene boca y no habla, tiene ojos y no ve.",
    "Tiene patas y no anda, tiene plumas y no vuela."
];

const hangmanWords = [
    "programacion", "javascript", "whatsapp", "bot", "nodejs",
    "computadora", "teclado", "raton", "pantalla", "internet",
    "servidor", "cliente", "base de datos", "frontend", "backend",
    "desarrollador", "ingeniero", "software", "hardware", "algoritmo",
    "variable", "funcion", "objeto", "clase", "herencia",
    "polimorfismo", "encapsulamiento", "abstraccion", "interfaz", "modulo"
];

const badWords = ["mala palabra1", "mala palabra2"]; // Añade aquí las malas palabras que quieras filtrar

client.on('group_join', (notification) => {
    client.sendMessage(notification.id.remote, '¡Bienvenido al grupo! Disfruta tu estancia. Aquí podrás participar en juegos, comprar waifus y mucho más.');
});

client.on('group_leave', (notification) => {
    client.sendMessage(notification.id.remote, '¡Adiós! Esperamos verte pronto. Recuerda que siempre serás bienvenido en nuestro grupo.');
});

client.on('message', message => {
    if (message.body.startsWith('#Reg')) {
        const user = message.body.split(' ')[1];
        registeredUsers.add(user);
        client.sendMessage(message.from, `Usuario ${user} registrado exitosamente.`);
    }

    if (message.body === '#ahorcado') {
        // Lógica del juego del ahorcado
    } else if (message.body === '#ppt') {
        // Lógica del juego piedra, papel o tijera
    } else if (message.body === '#adivinanza') {
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        client.sendMessage(message.from, riddle);
    } else if (message.body === '#juego') {
        const options = [
            "1. Pistola",
            "2. Bate",
            "3. Piedra",
            "4. Zapato",
            "5. Puños limpios"
        ];
        client.sendMessage(message.from, `Un tigre te está atacando, ¿con qué te defenderías?\n${options.join('\n')}`);
    }

    if (message.body === '#apagar' && message.from === ownerNumber) {
        client.destroy();
    }

    if (message.body.startsWith('#comprar')) {
        const item = message.body.split(' ')[1];
        if (itemsForSale.waifus.includes(item)) {
            client.sendMessage(message.from, `Has comprado a ${item} exitosamente.`);
        }
    }

    if (registeredUsers.has(message.from)) {
        const currentRank = userRanks.get(message.from) || 0;
        userRanks.set(message.from, currentRank + 1);
        client.sendMessage(message.from, `Tu rango actual es ${currentRank + 1}`);
    }

    if (message.body.startsWith('#descargar')) {
        const url = message.body.split(' ')[1];
        exec(`wget -O archivo ${url}`, (error, stdout, stderr) => {
            if (error) {
                client.sendMessage(message.from, 'Error al descargar el archivo.');
            } else {
                client.sendMessage(message.from, 'Archivo descargado exitosamente.');
            }
        });
    }

    if (badWords.some(word => message.body.includes(word))) {
        client.deleteMessage(message.from, message.id._serialized);
        client.sendMessage(message.from, 'Mensaje eliminado por contener malas palabras.');
    }
});

client.on('message', message => {
    if (message.body.includes('http') && !message.fromMe) {
        client.sendMessage(message.from, 'Enlaces no permitidos en este grupo.');
    }
});

client.initialize();
