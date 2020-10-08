const errorEventHandler        = require("./error")
const connectedEventHandler    = require("./connected")
const disconnectedEventHandler = require("./disconnected")
const messageEventHandler      = require("./message")

module.exports = {
  error:        errorEventHandler,
  connected:    connectedEventHandler,
  disconnected: disconnectedEventHandler,
  message:      messageEventHandler
}