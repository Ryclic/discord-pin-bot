const { SlashCommandBuilder } = require('@discordjs/builders');
const guildSchema = require('../schemas/guildInfoSchema.js');
const mongoose = require('mongoose');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Returns basic server information, including votecount number.'),

	async execute(interaction, client) {

        const guild = client.guilds.cache.get(interaction.guildId);
;        interaction.reply({ embeds: [{
            color: 0xff001e,
            thumbnail: {
              url: guild.iconURL()
            },
            title: 'Server info of ***"' + interaction.guild.name + '"***',
            fields: [{
              name: '----------------\n General Info \n----------------',
              value: 'Member Count: ' + interaction.guild.memberCount + '\n Owner: ' + client.users.cache.get(interaction.guild.ownerId).tag + 
              '\n Time Created: ' + interaction.guild.createdAt,
              inline: false
            },
            {
              name: '----------------\n Bot Info \n----------------',
              value: 'Required people to pin: ' + (await guildSchema.find({ serverID: interaction.guildId }))[0].votecount,

            },
            {
              name: "\u200b",
              value:"\u200b"
            }],
            timestamp: new Date(),
          }]});;
	},
};