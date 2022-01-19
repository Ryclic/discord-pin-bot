// -- Setup -- //
const { Client, Intents, Collection } = require('discord.js');

const mongoose = require('mongoose');
const guildSchema = require('./schemas/guildInfoSchema.js');

const fs = require('fs')
require('dotenv').config();

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

// -- Connect to MongoDB -- //
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

// -- Pin Schema -- // 
const messageSchema = new mongoose.Schema({
    textValue: { type: String, require: true},
    attachmentUrls: { type: Array, require: false},
    replyTo: { type: Array, require: false},
    dateSent: { type: Date, require: true, default: undefined},
    datePinned: { type: Date, default: Date.now},
    author: { type: Array, require: true}
});
var Message = {};
// connect to discord
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
// -- Guild Join/Leave Events -- //
client.on('guildCreate', guild => {
    console.log('Joined a new guild: ' + guild.name);
    console.log('Server ID: '+ guild.id);

    // create a messages collection for each server when join
    try{
        // attempt to access the schema to check for existance 
        guild = mongoose.model(guild.id);
    } catch (err) {

        message = mongoose.model(guild.id, messageSchema);

        console.log('Existing collection not found, created a new collection for this server!');
    }
})

client.on('guildDelete', async guild => {
    console.log('Left a guild: ' + guild.name);
    console.log('Server ID: ' + guild.id);
/*
    NOTE: This function drops all pins when the bot leaves server
    var db = mongoose.model(guild.id);
    await db.collection.drop().then(() => {
        console.log('Collection successfully dropped!');
    }).catch(() => {
        console.log('Collection was not able to be dropped.')
    });
*/
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
    // load old messages into cache
    const channel = client.channels.cache.get(messageReaction.message.channelId);
    await channel.messages.fetch(); 
    
    if(messageReaction.emoji.name == '📌'){
        const guildID = messageReaction.message.guild.id;
        const message = messageReaction.message;
        const serverDB = mongoose.connection.db.collection(guildID);

        const reqVotecount = (await guildSchema.find({ serverID: guildID }))[0].votecount;
        const reactionCount = messageReaction.message.reactions.cache.get('📌').count;

        if(reactionCount >= reqVotecount){
            // -- check for reply to references -- 
            message.fetchReference()
                .then(msg => {
                    // first is content, second is origin message sender
                    const replyTo = [];
                    replyTo.push(msg.content);
                    replyTo.push(msg.author.id);
                    // ----------------!WRITE CODE TO INSERT INTO MONGODB!---------------
                    
                })
                .catch(err => {
                    console.log('No message reference found!')
                });
            
            // -- text message with attachment --
            if(message.attachments.length > 0){
                const attachments = [];
                for(at of message.attachments){
                    attachments.push(at);
                }
                // ----------------!WRITE CODE TO INSERT INTO MONGODB!---------------
                // check for empty message, only attachment
                // if(message.content) message.channel.send(message.content);

            }
            // -- just a normal text message -- 
            else{
                const content = message.content;
                const msg = new Message({ textValue : content });
                msg.save();
                
                // mongoose.connection.db.collection(guildID)
            }
            console.log('Message pinned!');
        }
    }
})
client.login(process.env.DISCORD_TOKEN);


/*
                for(at of message.attachments){
                    message.channel.send({
                        files: [{
                            attachment: at[1].url
                        }]
                    })
                }


                // use this to access the properties of a specific attachment
                console.log(attachments[1][1].url);
*/