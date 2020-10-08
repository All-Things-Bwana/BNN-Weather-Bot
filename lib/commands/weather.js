const { promisify } = require("util")
const DiscordJS     = require("discord.js")
const weatherJS     = require("weather-js")

const id   = "weather"
const args = [
  [],
  ["<location>"],
  ["@username"]
]

async function run({ message, settings, profiles }) {
  message.isReply = true
  message.output  = "Something went wrong 😱\nI was unable to fetch a weather report for you"

  try {

    let query, profile

    if (message.mentions.length <= 0 && message.command.args.length >= 1) {
      
      query = message.command.args.join(' ')

    } else {

      if (profiles.length <= 0)
        return message

      if (message.mentions.length) {
        profile = profiles.find(profile => profile.id == message.mentions[0].id)
        if (profile) profile.username = message.mentions[0].username
      } else {
        profile = profiles.find(profile => profile.id == message.author.id)
        if (profile) profile.username = message.author.username
      }

      message.output  = `Sorry, I don't have a location set for you\nUse \`${settings.prefix}location <name or zip code>\` in a direct message to me to set one.`

      if (!profile)
        return message
 
      query = profile.location

    }

    if (!query)
      return message
    
    message.isReply = false

    const data = await promisify(weatherJS.find)({
      search: query,
      degreeType: 'C'
    })

    const { location, current, forecast } = data[0]

    message.output = new DiscordJS.MessageEmbed()

    message.output.setAuthor(`Weather report for ${profile ? profile.username : location.name}`, current.imageUrl)        
    message.output.setColor(settings.color)
    
    message.output.addField(`${current.day} ${current.observationtime}`, current.skytext)
    message.output.addField("Temp", `${current.temperature}°C/${Math.floor(current.temperature*1.8+32)}°F`, true)
    message.output.addField("Feels like", `${current.feelslike}°C/${Math.floor(current.feelslike*1.8+32)}°F`, true)
    
    const [ windKph, windUnit, windDirection ] = current.winddisplay.match(/\d+|km\/h|\w+/g)
    message.output.addField("Wind", `${Math.round(windKph * 0.277778)}m/s or ${Math.round(windKph * 0.621371)}mph ${windDirection || ''}`, true)

    message.output.addField(`${forecast[1].day} forecast`, forecast[1].skytextday)
    message.output.addField("Temp low", `${forecast[1].low}°C/${Math.floor(forecast[1].low*1.8+32)}°F`, true)
    message.output.addField("Temp high", `${forecast[1].high}°C/${Math.floor(forecast[1].high*1.8+32)}°F`, true)
    message.output.addField("Precip probability", `${parseInt(forecast[1].precip)}%`, true)

    message.output.setFooter("Weather report provided by Microsoft")

    return message
  
  } catch (err) {

    console.error(err)

    message.isReply = true
    message.output  = "Something went wrong 😱\nI was unable to fetch a weather report for you"
        
  }

  return message
}

module.exports = {id, args, run}