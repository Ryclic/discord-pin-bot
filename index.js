// setup
const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs')
const guildSchema = require('./schemas/guildSchema.js');
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ]
 })
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
client.on('messageReactionAdd', async (messageReaction, user) => {
    // fetch all old messages
    const channel = client.channels.cache.get(messageReaction.message.channelId);
    await channel.messages.fetch();

    if(messageReaction.emoji.name == '📌'){
        // check if emoji count is greater than the default or configured number required to pin thru votecount in db, if so then call pinMessage.js
        const guildID = messageReaction.message.guild.id;
        const reqVotecount = (await guildSchema.find({ serverID: guildID }))[0].votecount;
        const reactionCount = messageReaction.message.reactions.cache.get('📌').count;
        channel.send('Test!');
        if(reactionCount >= reqVotecount){
            // write code to put message in db
            console.log('Message pinned!');
        }
    }
})
client.login(process.env.DISCORD_TOKEN);

