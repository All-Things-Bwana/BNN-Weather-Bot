const utils = require("../utils")

const id = "location"
const args = [
  [],
  ["<location>"],
  ["remove"],
]

function run({ message, profiles }) {

  if (!message.isDM) return message

  let profile = profiles.find(profile => profile.id == message.author.id)

  if (message.command.args.length > 0 && message.command.args[0].toLowerCase() == "remove") {

    if (!profile) return message

    delete profile.location
    utils.saveData({profiles})

    message.isReply = true
    message.output  = "Your location has been removed."

  } else if (message.command.args.length <= 0) {

    message.isReply = true

    if (!profile || !profile.location) {
    
      message.output  = "I don't have a location set for you yet."
    
    } else {
    
      message.output = `Your location is set to ${profile.location}`
    
    }

  } else {
    
    if (!profile) {
  
      profile = {id: message.author.id, location: message.command.args.join(' ')}
      profiles.push(profile)
  
    } else {
  
      profile.location = message.command.args.join(' ')
  
    }

    utils.saveData({profiles})

    message.isReply = true
    message.output  = `Your location is now set to "${profile.location}"`
  }

  return message

}

module.exports = {id, args, run}