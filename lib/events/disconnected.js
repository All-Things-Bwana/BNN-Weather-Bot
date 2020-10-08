function disconnectedEventHandler(bot) {

  console.log("Discord disconnected, attempting to reconnect")

  bot.login(process.env.DISCORD_TOKEN)

}

module.exports = disconnectedEventHandler