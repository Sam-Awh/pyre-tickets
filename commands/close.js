const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the ticket.'),
  async execute(interaction, client) {
        const guild = client.guilds.cache.get(interaction.guildId);
        const chan = guild.channels.cache.get(interaction.channelId);

        if (chan.name.includes('ticket')) {
          const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageButton()
            .setCustomId('confirm-close')
            .setLabel('Close Ticket')
            .setStyle('DANGER'),
            new client.discord.MessageButton()
            .setCustomId('no')
            .setLabel('Cancel ticket closure')
            .setStyle('SECONDARY'),
            );

            const verif = await interaction.reply({
              content: 'Are you sure you want to close the ticket?',
              components: [row]
            });
  
            const collector = interaction.channel.createMessageComponentCollector({
              componentType: 'BUTTON',
              time: 10000
            });

            collector.on('collect', i => {
              if (i.customId == 'confirm-close') {
                interaction.editReply({
                  content: `The ticket has been closed by <@!${interaction.user.id}>`,
                  components: []
                });
             
                chan.edit({
                  name: `closed-${chan.name}`,
                  permissionOverwrites: [
                    {
                      id: client.users.cache.get(chan.topic),
                      deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                    },
                    {
                      id: client.config.roleSupport,
                      allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                    },
                    {
                      id: interaction.guild.roles.everyone,
                      deny: ['VIEW_CHANNEL'],
                    },
                  ],
                })
                .then(async () => {
                  const embed = new client.discord.MessageEmbed()
                  .setColor(config.embedColor)
                  .setAuthor('Ticket', ' ')
                  .setDescription('```Saving transcript...```')
                  .setFooter('© Pyreworks', ' ')
                  .setTimestamp();
               
                  const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('delete-ticket')
                    .setLabel('Delete Ticket')
                    .setEmoji('🗑️')
                    .setStyle('DANGER'),
                    );
                    
                    chan.send({
                      embeds: [embed],
                      components: [row]
                    });
                  });
                  
                  collector.stop();
                };
                if (i.customId == 'no') {
                  interaction.editReply({
                    content: 'Ticket closure cancelled!',
                    components: []
                  });
                  collector.stop();
                };
              });
              
              collector.on('end', (i) => {
                if (i.size < 1) {
                  interaction.editReply({
                    content: 'Ticket closure cancelled!',
                    components: []
                  });
                };
      });
    }
    else {
      await interaction.reply({
        content: 'This command can only be used in a ticket.',
        ephemeral: true
      });
    }
  }
};