const id   = "help"
const args = [
  [],
  ["<command>"]
]

async function run({ message, settings }) {

  const commands = require("./")

  if (message.command.args.length <= 0) {
  
    message.output = [
      "Available commands are:",
      commands.map(cmd => settings.prefix + cmd.id).join(' ')
    ].join("\n")
  
  } else {

    let cmdID = message.command.args[0].toLowerCase()
    cmdID = cmdID.indexOf(settings.prefix) == 0 ? cmdID.substring(settings.prefix.length, cmdID.length) : cmdID

    const command = commands.find(cmd => cmdID == cmd.id)
    
    if (!command) {
      message.output = `The command \`${cmdID}\` does not exist.`
      return message
    }

    message.output =
      `Usages for \`${settings.prefix}${command.id}\`\n` + 
      command.args.map(subArgs => `\`${settings.prefix}${command.id} ${subArgs.join(' ')}\``).join('\n')

  }

  return message

}

module.exports = {id, args, run}
