const { SlashCommandBuilder } = require('@discordjs/builders');
const guildSchema = require('../schemas/guildSchema.js');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('votecount')
		.setDescription('Sets the number of people needed to approve a pin.')
        .addIntegerOption(option => 
            option.setName('count')
                .setDescription('Number of people to approve a pin')
                .setRequired(true)),

	async execute(interaction) {
        await new guildSchema();
        const votecount = interaction.options.getInteger('count');
        const data = {serverID: interaction.guildId, votecount: votecount}
        // check if there is already document for current server, if not create one
        // if there is document then find and save given votecount
        mongoose.connection.db.collection('guild').count(async function(err, count) {
            if(err != undefined) console.dir('Error while inserting votecount to database: ' + err);
            
            const doesExist = await guildSchema.exists({ serverID: interaction.guildId });
            if(!(doesExist)) {
                console.log('No found records for current server, adding new record.');
                guildSchema(data).save();
            }
            else {
                const guild = await guildSchema.find({ serverID: interaction.guildId });
                guild[0].votecount = votecount;
                await guild[0].save();
            }
        });
        interaction.reply({ content: 'Success! The votecount number has been set to ' + votecount + '.', ephemeral: true });
	},
};