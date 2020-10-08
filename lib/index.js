/**
  * BNN Weather
  *
  *
  * MIT License | Copyright (c) 2020 All Things Bwana
  */

require("dotenv-flow").config()

const DiscordJS = require("discord.js")

const eventHandelers = require("./events")
const { loadData }   = require("./utils")

// Quit early if missing credentials
if (!process.env.DISCORD_TOKEN)
  return console.log("Missing Discord token")

const { settings, profiles } = loadData()

const bot = new DiscordJS.Client()

bot.on("error",        (err)  => eventHandelers.error(err))
bot.on("ready",        ()     => eventHandelers.connected(bot))
bot.on("disconnected", ()     => eventHandelers.disconnected(bot))
bot.on("message",      (data) => eventHandelers.message(bot, settings, profiles, data))

bot.login(process.env.DISCORD_TOKEN)