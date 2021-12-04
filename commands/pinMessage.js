const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pin')
		.setDescription('Pins a message!'),
	async execute(interaction) {
		let msg = '';
		try{
			const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
			console.log('Pin message content = ' + repliedTo.content);
			msg = 'Looking for two reactions to proceed with pin...';
		}
		catch(err){
			msg = 'You need to reply to a message to use this command!';
		}
		
		message.reply({
			content: msg,
			ephemeral: false
		})
		await interaction.reply('React with pin on this message');
	},
};