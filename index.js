const { Client, Intents, Collections } = require('discord.js');
const mongoose = require('mongoose');
// note: remember to install fs with npm install fs --save
const fs = require('fs')
// discord intents
const client = new Client({ 
    intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
    ]
 })
 require('dotenv').config();
// connect to mongodb
mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to the database!');
})
.catch((err) => {
    console.log(err);
})
// connect to discord
client.on('ready', () => {
    console.log('Bot is ready.');
})
// commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('messageCreate', (message) => {
    if(message.content == 'Ryan!'){
        message.reply({
            content: 'Hi Ryan!',
        })
    }
})
client.login(process.env.DISCORD_TOKEN);