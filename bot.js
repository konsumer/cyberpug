const dotenv = require('dotenv')
const Discord = require('discord.js')

dotenv.config()
const { DISCORD_TOKEN } = process.env

const client = new Discord.Client()

if (!DISCORD_TOKEN) {
  console.error('Please set DISCORD_TOKEN environment variable!')
  process.exit(1)
}

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  console.log(message.content)
  if (message.content === '!ping') {
    // send back "Pong." to the channel the message was sent in
    message.channel.send('Pong.')
  }
})

client.login(DISCORD_TOKEN)
