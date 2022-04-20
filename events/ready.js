const Discord = require("discord.js");

module.exports = async (bot) => {

    console.log(`${bot.user.username} is ready!
    `);
    bot.user.setActivity('tickets at Pyreworks', { type: 'WATCHING' })
    .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
      .catch(console.error);
}