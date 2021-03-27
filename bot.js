const dotenv = require('dotenv')
const Discord = require('discord.js')
const { readdirSync } = require('fs')

const express = require('express')
const crypto = require('crypto')
const cmd = require('node-cmd')

dotenv.config()

const { DISCORD_TOKEN, GITHUB_SECRET, PORT = 8000 } = process.env

// this handles automatic pulls from github
const app = express()
// requires you to run `git remote add origin YOUR_REPO_URL` in glitch-console
app.post('/github', (req, res) => {
  if (req.headers['x-github-event'] === 'ping') {
    return res.send('pong')
  }
  const hmac = crypto.createHmac('sha1', GITHUB_SECRET)
  const sig = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`
  if (req.headers['x-github-event'] === 'push' && sig === req.headers['x-hub-signature']) {
    cmd.get('git fetch origin main && git reset --hard origin/main && git pull origin main --force', (err, data) => {
      if (data) console.log(data)
      if (err) {
        console.error(err)
        res.status(500).send('An error occurred.')
      } else {
        cmd.run('refresh')
        return res.send('OK.')
      }
    })
  } else {
    res.status(500).send('Bad git request.')
  }
})
console.log(`Webserver listening on https://localhost:${PORT}`)
app.listen(PORT)

// BOT is here

if (!DISCORD_TOKEN) {
  console.error('Please set DISCORD_TOKEN environment variable!')
  process.exit(1)
}

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
