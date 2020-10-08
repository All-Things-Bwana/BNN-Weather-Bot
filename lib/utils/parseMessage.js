function parseMessage(bot, settings, data) {

  const message = {
    input:       '',
    timestamp:   0,
    author:      {username: ''},
    self:        {username: bot.user.username},
    isMentioned: false,
    isBot:       false,
    isDM:        false,
    isReply:     false,
    mentions:    [],
    original:    data
  }

  try {

    message.input     = data.cleanContent
    message.timestamp = data.createdTimestamp
    message.author    = data.author
    message.self      = {username: bot.user.username}
    message.isBot     = false
    message.isDM      = data.channel.type == "dm"
    message.mentions  = []
    message.original  = data

    if ( message.author.username != '' 
      && message.self.username   != ''
      && message.author.username.toLowerCase() == message.self.username.toLowerCase()
    ) {
      message.isBot = true
    }

    if (data.mentions)
      message.mentions = data.mentions.users.map(({ id, username }) => ({id, username}))

    // console.log(message)

    if (message.input.substr(0, settings.prefix.length) == settings.prefix) {
      const args = message.input.split(' ')
      const id   = args.shift().substring(settings.prefix.length).toLowerCase()

      message.command = {id, args}
    }
  
  } catch (err) {

    console.error(err)
  
  }

  return message

}

module.exports = parseMessage