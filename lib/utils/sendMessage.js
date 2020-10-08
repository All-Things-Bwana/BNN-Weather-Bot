function sendMessage(bot, message) {
  
  if (message.isReply) {
    message.original.reply(message.output)
  } else {
    message.original.channel.send(message.output)
  }

}

module.exports = sendMessage