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

// load all commands from commands directory and set them up as global commands
readdirSync(`${__dirname}/commands`)
  .filter(file => file.endsWith('.js'))
  .map(r => [r, require(`${__dirname}/commands/${r}`)])
  .forEach(r => {
    const command = require(`${__dirname}/commands/${r}`)
    client.commands.set(command.name, command)
  })

client.once('ready', () => {
  console.log('Ready!')
})

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log')
  if (!channel) return
  channel.send(`Welcome to the server, ${member}`)
})

client.login(DISCORD_TOKEN)
