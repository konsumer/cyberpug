const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'embed',
  description: 'Test out embed (fancy message).',
  execute (message, args) {
    const embed = new MessageEmbed()
    // Set the title of the field
      .setTitle('A slick little embed')
    // Set the color of the embed
      .setColor(0xff0000)
    // Set the main content of the embed
      .setDescription('Hello, this is a slick embed!')

    // Send the embed to the same channel as the message
    message.channel.send(embed)
  }
}
