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

client.login(DISCORD_TOKEN)
