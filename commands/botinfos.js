const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Bot Information'),
  async execute(interaction, client) {
    const embed = new client.discord.MessageEmbed()
      .setColor('#FE4D29')
      .setAuthor('Bot Info', client.user.avatarURL())
      .setDescription('A not-so-generic ticket bot developed by **Pyreworks.**')
      .addField('Pyreworks Discord', 'Join our Discord Server to get updates or buy a product! \nhttps://discord.gg/8DMrfekBJ6',)
      .addField('About Pyreworks', 'Pyreworks is a service team of passionate developers \nwho may or may not have had a hand in creating THIS bot :)')
      .setFooter(client.config.footerText, client.user.avatarURL());

    await interaction.reply({
      embeds: [embed]
    });
  },
};