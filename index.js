const { Client, Intents } = require('discord.js');
// const mongoose = require('mongoose');
require('dotenv').config();
// discord intents
const client = new Client({ 
    intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
    ]
 })
// connect to mongodb
// mongoose.connect(process.env.MONGODB_SRV, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log('Successfully connected to the database!');
// })
// .catch((err) => {
//     console.log(err);
// })
// connect to discord
client.on('ready', () => {
    console.log('Bot is ready.');
})

client.on('messageCreate', (message) => {
    if(message.content == 'Ryan!'){
        message.reply({
            content: 'Hi Ryan!',
        })
    }
})
client.login(process.env.DISCORD_TOKEN);