const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pin')
		.setDescription('Sets vote to pin a message!'),
	async execute(interaction) {
		await interaction.reply('React with pin on this message');
	},
};