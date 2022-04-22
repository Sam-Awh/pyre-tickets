const Discord = require("discord.js");
const fs = require("fs");
const color = JSON.parse(fs.readFileSync(`Storage/color.json`, `utf8`));

exports.run = async (bot, message, args, functions) => {

if(message && message.deletable) message.delete().catch(e => {});

let embed = new Discord.MessageEmbed()
.setTitle(`Create a Ticket!`)
.setColor(color.pyre)
.setDescription(`Create a ticket to privately message our support team regarding any related issue.`)
.addField("Usage?","React with the 🎟️ emote below to create a ticket.",true)
.addField("What happens?","When you create a ticket, a support team member will review your request in a private channel.",true)
.setFooter(`Pyre | Tickets`, bot.user.displayAvatarURL());
message.channel.send(embed).then(m => {
  m.react('🎟️');
});

}

exports.help = {
    name: "ticket",
    aliases: ['createticket', "t"]
}