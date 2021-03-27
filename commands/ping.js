// send back "Pong-gong-gong-gong!" to the channel the message was sent in when user says "!ping"

module.exports = (message, client) => {
  message.channel.send('Pong-gong-gong-gong!')
}
