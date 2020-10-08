const assert = require("assert")
const sinon  = require("sinon")

const pingCommand = require("../../lib/commands/ping")

describe("commands/ping()", function() {

  it("Should have appropriate properties", function() {
    assert.deepEqual(pingCommand, {
      id:   "ping",
      args: [[]],
      run:  pingCommand.run
    })
  })

  it("should output \"Pong!\"", async function() {
    const message = await pingCommand.run({message: {}})

    assert.deepEqual(message, {output: "pong!"})
  })

})