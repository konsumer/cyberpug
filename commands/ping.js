module.exports = {
  name: '!embed',

  description: 'Test command to see that cyberpug is online',

  execute (message, args, client) {
    message.channel.send('Pong-gong-gong-gong!')
  }
}
