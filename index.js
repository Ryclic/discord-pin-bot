// setup
const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs')
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ]
 })
const guildSchema = require('./schemas/guildSchema.js');
require('dotenv').config();
// connect to MongoDB
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

// connect to Discord
client.on('ready', () => {
    console.log('Bot is ready.');
})
// read commands and set in client
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
// interation and command responses
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;
    // get command from list of commands, if invalid quit
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
    // execute the command
	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})
// check for pin requests via emoji
client.on('messageReactionAdd', (messageReaction, user) => {
    if(messageReaction.emoji.name == '📌'){
        // check if emoji count is greater than the default or configured number required to pin thru votecount in db, if so then call pinMessage.js
    }
})
client.login(process.env.DISCORD_TOKEN);

