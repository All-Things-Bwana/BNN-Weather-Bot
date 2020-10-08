const id   = "ping"
const args = [[]]

async function run({ message }) {

  message.output = "pong!"

  return message

}

module.exports = {id, args, run}