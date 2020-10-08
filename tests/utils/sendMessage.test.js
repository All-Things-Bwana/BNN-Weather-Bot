const assert = require("assert")
const sinon  = require("sinon")

const sendMessage = require("../../lib/utils/sendMessage")

describe("utils/sendMessage()", function() {

  after(function() {
    sinon.reset()
  })
  
  it("should send messages", function() {
    const message = {
      original: {
        channel: {
          send: sinon.spy()
        },
        reply: sinon.spy()
      },
      output: "foo bar"
    }

    sendMessage(undefined, message)

    message.isReply = true
    sendMessage(undefined, message)

    assert.equal(message.original.channel.send.args[0][0], message.output)
    assert.equal(message.original.reply.args[0][0],        message.output)
    
  })

})