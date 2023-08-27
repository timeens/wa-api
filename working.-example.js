const { Client, LocalAuth } = require("whatsapp-web.js");



const client = new Client({
    puppeteer: { headless: false }, // Make headless true or remove to run browser in background
    authStrategy: new LocalAuth({ clientId: 'tim', dataPath: './sessions' })
  });

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', async () => {
    console.log('Client is ready!');

    const number = "41763229207";
    const full = `${number}@c.us`;
    if(await client.isRegisteredUser(full)){
        await client.sendMessage(full, "Testmessage")
    } else {
        console.log(`${full} does not exist`)
    }

});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
});

client.on('auth_failure', () => {
    console.log('Authentication error!');
});

client.on('message', (msg) => {
    console.log('Client message received!');
});

client.on('message', message => {
	if(message.body === '!ping') {
		message.reply('pong');
	}
});


console.log('init...');
client.initialize();
 
process.on("SIGINT", async () => {
    console.log("(SIGINT) Shutting down...");
    await client.destroy();
    process.exit(0);
})