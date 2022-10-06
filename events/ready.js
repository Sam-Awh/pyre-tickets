module.exports = {
  name: 'ready',
  async execute(client) {
    client.user.setPresence({ activities: [{ name: `your tickets.`, type: 'WATCHING' }] });
    client.user.setStatus('dnd');
    console.log('Pyre Loader is online!')
    console.log('© Pyreworks');

    const oniChan = client.channels.cache.get(client.config.ticketChannel)
    //uwu
    oniChan.send('https://i.ibb.co/n7RsTyR/Example-Banner11.png');
    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor('#FE4D29')
        .setAuthor('Pyreworks Support', '')
        .setDescription('Need any help or have any questions? Create a ticket and go ahead following the instructions.')
        .addFields(
          { name: 'Ticket Categories', value: 'Here\'s all the categories and what they\'re about. \n <:application:967707003562647552> Application | Apply for a position. \n <:alert:968144163986104341> Support | Get your questions answered. \n <:pyregear:967707003705237524> Partnerships | Inquire about a possible partnership. \n <:cart:967707022655127642> Order | Place an order to buy a product from us!' },
          { name: 'Guidelines', value: '\u2022 Abusing our Ticket System will lead to a temporary ban of 7 days. \n \u2022 Please make sure to converse in english in the ticket channel. \n \u2022 Be understanding.'}
        )
        .setFooter(client.config.footerText, '')
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('open-ticket')
          .setLabel('Open a Ticket')
          .setEmoji('🎫')
          .setStyle('PRIMARY'),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }

    const toDelete = 10000;

    async function fetchMore(channel, limit) {
      if (!channel) {
        throw new Error(`Channel created ${typeof channel}.`);
      }
      if (limit <= 100) {
        return channel.messages.fetch({
          limit
        });
      }

      let collection = [];
      let lastId = null;
      let options = {};
      let remaining = limit;

      while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
          options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
          break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
      }
      collection.remaining = remaining;

      return collection;
    }

    const list = await fetchMore(oniChan, toDelete);

    let i = 1;

    list.forEach(underList => {
      underList.forEach(msg => {
        i++;
        if (i < toDelete) {
          setTimeout(function () {
            msg.delete()
          }, 1000 * i)
        }
      })
    })

    setTimeout(() => {
      sendTicketMSG()
    }, i);
  },
};
