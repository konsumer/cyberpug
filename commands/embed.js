const { MessageEmbed } = require('discord.js')

// Get more info here

module.exports = {
  name: '!embed',

  description: 'Test out embed (fancy message).',

  execute (message, args, client) {
    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Embed Example')

      // Set the URL for the title
      .setURL('https://discordjs.guide/popular-topics/embeds.html')

      // Set the color of the embed to red
      .setColor(0xff0000)

      // Set the main content of the embed
      .setDescription('Hello, this is a demo embed. Read more by clicking on the link on the title.')

    // Send the embed to the same channel as the message
    message.channel.send(embed)
  }
}
