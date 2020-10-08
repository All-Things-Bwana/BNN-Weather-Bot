const assert = require("assert")
const sinon  = require("sinon")

const disconnectedEventHandler = require("../../lib/events/disconnected")

describe("events/disconnected()", function() {

  before(function() {
    bot = {
      login: sinon.spy()
    }

    sinon.stub(console, "log").callsFake(() => { /* be quiet */ })

    disconnectedEventHandler(bot)
  })

  after(function() {
    sinon.restore()
  })

  it("should log disconnections", function() {
    assert.deepEqual(console.log.args[0][0], "Discord disconnected, attempting to reconnect")
  })

  it("should attempt to reconnect")
  // it("should attempt to reconnect", function() {
  //   assert.deepEqual(bot.login.args[0], ["foo"])
  // })

})