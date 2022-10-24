const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a user')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('Member to be added to the ticket.')
      .setRequired(true)),
  async execute(interaction, client) {
    const chan = client.channels.cache.get(interaction.channelId);
    const user = interaction.options.getUser('target');
    if (chan.name.includes('ticket')) {
      if (chan.permissionOverwrites.has(user.id)) {
        await interaction.reply({
          content: 'This user is already in the ticket.',
          ephemeral: true
        });
      } else {
        await chan.permissionOverwrites.create(user.id, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true,
          EMBED_LINKS: true,
          ATTACH_FILES: true,
          ADD_REACTIONS: true
        }
        );
        await interaction.reply({
          content: `Added ${user.tag} to the ticket.`,
          ephemeral: true
        });
      };
    }
    else {
      await interaction.reply({
        content: 'This command can only be used in a ticket.',
        ephemeral: true
      });
    }
  },
};