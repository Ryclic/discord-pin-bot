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
            title: "This is your title, it can hold 256 characters",
            url: "https://discord.js.org/#/docs/main/master/class/MessageEmbed",
            description: "This is the main body of text, it can hold 2048 characters.",
            fields: [{
              name: "This is a single field title, it can hold 256 characters",
              value: "This is a field value, it can hold 1024 characters.",
              inline: false
            },
            {
              name: "Inline fields",
              value: "They can have different fields with small headlines, and you can inline them.",
              inline: true
            },
            {
              name: "Masked links",
              value: "You can put [masked links](https://discord.js.org/#/docs/main/master/class/MessageEmbed) inside of rich embeds.",
              inline: true
            },
            {
              name: "Markdown",
              value: "You can put all the *usual* **__Markdown__** inside of them.",
              inline: true
            },
            {
              name: "\u200b",
              value:"\u200b"
            }],
            timestamp: new Date(),
          }]});;
	},
};