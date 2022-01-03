// setup
const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs')
const guildSchema = require('./schemas/guildInfoSchema.js');
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
    useUnifiedTopology: true
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
// register commands to discord
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('guildCreate', guild => {
    console.log('Joined a new guild: ' + guild.name);
    console.log('Server ID: '+ guild.id);
    // create a messages collection for each server when join
    try{    
        guild = mongoose.model(guild.id)
    } catch (err) {
        mongoose.model(guild.id, new mongoose.Schema({ 
            attachments: [{ type: String }],
            textValue: { type: String, require: true},
            messageID: { type: Number, default: 2},
            datePinned: { type: String },
            author: { type: String },
            replyTo: { type: String },
        }));
        console.log('Existing collection not found, creating a new collection for this server!');
    }

    
})

client.on('guildDelete', async guild => {
    console.log('Left a guild: ' + guild.name);
    console.log('Server ID: ' + guild.id);
    // NOTE: This function drops all pins when the bot leaves server
    // var db = mongoose.model(guild.id);
    // await db.collection.drop().then(() => {
    //     console.log('Collection successfully dropped!');
    // }).catch(() => {
    //     console.log('Collection was not able to be dropped.')
    // });
})

// slash commands
client.on('interactionCreate', async (interaction) => {
    
    if(!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.log(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.on('messageReactionAdd', async (messageReaction, user) => {
    
    const channel = client.channels.cache.get(messageReaction.message.channelId);
    await channel.messages.fetch(); // load old messages into cache

    if(messageReaction.emoji.name == '📌'){
        const guildID = messageReaction.message.guild.id;
        const reqVotecount = (await guildSchema.find({ serverID: guildID }))[0].votecount;
        const reactionCount = messageReaction.message.reactions.cache.get('📌').count;
        if(reactionCount >= reqVotecount){
            

            console.log('Message pinned!');
        }
    }
})
client.login(process.env.DISCORD_TOKEN);

