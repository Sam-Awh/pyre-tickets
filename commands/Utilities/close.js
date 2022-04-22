const Discord = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const dateFormat = require("dateformat");
const color = JSON.parse(fs.readFileSync(`Storage/color.json`, `utf8`));

exports.run = async (bot, message, args, functions) => {

    let logsChannel = message.guild.channels.cache.find(c => c.id === db.get(`logs_${message.guild.id}`));

    if(!message.channel.name.startsWith(`ticket-`)) return;
    
    if(message.author.id === db.get(`ticket.${message.channel.name}.user`)) {
    
      let userEmbed = new Discord.MessageEmbed()
      .setAuthor(`🗑️ | Ticket Closed`)
      .setColor(color.pyre)
      .setDescription(`The author of the ticket proceeded to close it.`)
      .setTimestamp()
      .setFooter(`Pyre | Tickets`, bot.user.displayAvatarURL())
      .addField(`Information`, `**User :** \`${message.author.tag}\`\n**ID :** \`${message.author.id}\`\n**Ticket :** \`${message.channel.name}\`\n**Date :** \`${dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss")}\``);
    
      db.delete(`ticket.${message.channel.name}`);
      if(logsChannel) await logsChannel.send(userEmbed);
      await message.channel.delete();
    } else {
    
      let support = message.guild.roles.cache.find(r => r.name === "Pyre Support");
      if(!support) return functions.errorEmbed(message, message.channel, "The `Pyre Support` role does not exist, please create it.");
      if(message.deletable) message.delete();
    
      if(args[0] === "force"){
    
        let forceEmbed = new Discord.MessageEmbed()
        .setAuthor(`🗑️ | Ticket Closed`)
        .setColor(color.pyre)
        .setDescription(`A member with role ${support} force deleted a ticket.`)
        .setTimestamp()
        .setFooter(`Pyre | Tickets`, bot.user.displayAvatarURL())
        .addField(`Information`, `**User :** \`${message.author.tag}\`\n**ID :** \`${message.author.id}\`\n**Ticket :** \`${message.channel.name}\`\n**Date :** \`${dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss")}\``);
    
        let embed1 = new Discord.MessageEmbed()
        .setAuthor(`📥 | Ticket Closed`)
        .setColor(color.pyre)
        .setDescription(`\`${message.author.tag}\` has forced your ticket to be closed.`)
        .setFooter(`Pyre | Tickets`, bot.user.displayAvatarURL());
        db.delete(`ticket.${message.channel.name}`);
        if(logsChannel) await logsChannel.send(forceEmbed);
        if(bot.users.cache.get(db.get(`ticket.${message.channel.name}.user`))) bot.users.cache.get(db.get(`ticket.${message.channel.name}.user`)).send(embed1).catch(e => {console.log(e)})
        message.channel.delete();
        
    
      } else {
    
        let staffEmbed = new Discord.MessageEmbed()
      .setAuthor(`🗑️| Closing Request`)
      .setColor(color.pyre)
      .setDescription(`A member with role ${support} has requested the ticket be closed.`)
      .setTimestamp()
      .setFooter(`Pyre | Tickets`, bot.user.displayAvatarURL())
      .addField(`Information`, `**User :** \`${message.author.tag}\`\n**ID :** \`${message.author.id}\`\n**Ticket :** \`${message.channel.name}\`\n**Date :** \`${dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss")}\``);
    
        if(!message.guild.member(message.author).roles.cache.has(support.id)) return functions.errorEmbed(message, message.channel, "Sorry, you don't have the `Ticket Support` role.");
        let embed2 = new Discord.MessageEmbed()
        .setColor(color.pyre)
        .setTitle(`🎟️ | Ticket Completed`)
        .setDescription(`React with \\🗑️ to close the ticket or do not react if you have other requests.`)
        .setFooter(`Pyre | Tickets`, bot.user.displayAvatarURL());
        if(logsChannel) await logsChannel.send(staffEmbed);
        message.channel.send(embed2).then(m => m.react(`🗑️`));
      }
    
    }

}

exports.help = {
    name: "close",
    aliases: []
}