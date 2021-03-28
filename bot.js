const dotenv = require('dotenv')
const Discord = require('discord.js')
const { readdirSync } = require('fs')
const express = require('express')
const gh = require('./github-autodeploy')

// get environemnt variables
dotenv.config()
const { DISCORD_TOKEN, PORT = 8000, GITHUB_SECRET } = process.env

// fatal
if (!DISCORD_TOKEN) {
  console.error('Please set DISCORD_TOKEN environment variable!')
  process.exit(1)
}

// non-fatal
if (!GITHUB_SECRET) {
  console.error('Github auto-deploy is disabled. Please set GITHUB_SECRET environment-variable.')
}

// WEBSERVER
// responds at https://cyberpug.glitch.me/

const app = express()
app.use(express.json())

// add /github auto-deploy webhook
app.use(gh(GITHUB_SECRET))

console.log(`Webserver listening on https://0.0.0.0:${PORT}`)
app.listen(PORT)

// BOT

const client = new Discord.Client()
client.commands = new Discord.Collection()

// load all commands from commands directory and set them up as global commands
readdirSync(`${__dirname}/commands`)
  .filter(file => file.endsWith('.js'))
  .forEach(r => {
    const command = require(`${__dirname}/commands/${r}`)
    client.commands.set(command.name, command)
  })

// use dynamic commands (from above)
client.on('message', message => {
  if (message.author.bot) {
    console.log('Author is a bot. Skipping.')
    return
  }

  const args = message.content.trim().split(/ +/)
  const command = args.shift().toLowerCase()

  if (!client.commands.has(command)) {
    console.log(`Unknown command: ${command}`)
    return
  }

  client.commands.get(command).execute(message, args, client)
})

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log')
  if (!channel) return
  channel.send(`Welcome to the server, ${member}. I am a demo-bot. Type !help to see what I can do.`)
})

// notify console that I am ready
client.once('ready', () => {
  console.log('Ready!')
})

client.login(DISCORD_TOKEN)
