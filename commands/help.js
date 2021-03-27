const { MessageEmbed } = require('discord.js')

module.exports = {
  name: '!help',

  description: 'Show this help',

  execute (message, args, client) {
    const embed = new MessageEmbed()
      .setTitle('CyberPug Help')
      .setURL('https://github.com/konsumer/cyberpug')
      .setColor(0x00ff00)
      .setDescription("Hi, I am CyberPug, and I'm here to help. Here are the available commands:")

    client.commands.forEach(command => {
      embed.addField(command.name, command.description, true)
    })

    message.channel.send(embed)
  }
}
