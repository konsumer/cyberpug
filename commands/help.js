module.exports = {
  name: '!help',

  description: 'Show this help',

  execute (message, args, client) {
    // here I use another style for embed
    const embed = {
      title: 'CyberPug Help',
      url: 'https://github.com/konsumer/cyberpug',
      color: 0x00ff00, // green
      description: "Hi, I am CyberPug, and I'm here to help. Here are the available commands:",
      fields: []
    }

    // collect info abotu the global commands and add them as fields
    client.commands.forEach(command => {
      embed.fields.push({
        name: command.name,
        value: command.description,
        inline: false
      })
    })

    message.channel.send({ embed })
  }
}
