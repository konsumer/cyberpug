const dotenv = require('dotenv')
const Discord = require('discord.js')
const { readdirSync } = require('fs')

dotenv.config()
const { DISCORD_TOKEN } = process.env

if (!DISCORD_TOKEN) {
  console.error('Please set DISCORD_TOKEN environment variable!')
  process.exit(1)
}

const client = new Discord.Client()

// load all commands from commands directory and put into an object keyed by name
const commands = readdirSync(`${__dirname}/commands`)
  .map((r) => [r, require(`${__dirname}/commands/${r}`)])
  .reduce((a, c) => {
    return { ...a, [c[0].split('.')[0]]: c[1] }
  }, {})

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  Object.keys(commands).forEach(command => {
    if (message.content.startsWith(`!${command}`)) {
      commands[command](message, client)
    }
  })
})

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log')
  if (!channel) return
  channel.send(`Welcome to the server, ${member}`)
})

client.login(DISCORD_TOKEN)
