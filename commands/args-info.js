module.exports = {
  name: '!args-info',

  description: 'Information about the arguments provided, for debugging.',

  execute (message, args, client) {
    if (!args.length) {
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    } else if (args[0] === 'foo') {
      return message.channel.send('bar')
    }
    message.channel.send(`Arguments: ${JSON.stringify(args)}\nArguments length: ${args.length}`)
  }
}
