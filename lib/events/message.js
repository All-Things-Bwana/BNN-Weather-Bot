const utils    = require("../utils")
const commands = require("../commands")

async function messageEventHandler(bot, settings, profiles, data) {

  let message = utils.parseMessage(bot, settings, data)

  // Quit early if the message is from a bot
  if (message.isBot) return

  if (message.command) {
  
    let command

    for (const key in commands) {
      if (commands[key].id == message.command.id)
        command = commands[key]
    }

    // Quit if the command does not exist
    if (!command) return
    
    message = await command.run({ bot, settings, profiles, message })
  
  }

  if (message.output)
    utils.sendMessage(bot, message)

}

module.exports = messageEventHandler