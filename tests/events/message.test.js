const assert = require("assert")
const sinon  = require("sinon")

const messageEventHandler = require("../../lib/events/message")
const commands            = require("../../lib/commands")
const utils               = require("../../lib/utils")

describe("events/message()", function() {
  before(function() {
    sinon.stub(utils, "parseMessage")
    sinon.stub(utils, "sendMessage")
  })
  
  beforeEach(function() {
    utils.parseMessage.resetHistory()
    utils.sendMessage.resetHistory()

    utils.parseMessage.callsFake(() => ({}))
    utils.sendMessage.callsFake(() => {})
  })

  after(function() {
    sinon.restore()
  })

  it("should handle messages", async function() {
    await messageEventHandler("foo", "bar", "baz", "qux")

    assert(utils.parseMessage.calledOnce)
    assert(!utils.sendMessage.called)
    assert.deepEqual(utils.parseMessage.args[0], ["foo", "bar", "qux"])
  })

  describe("commands", function() {

    it("should ignore commands from bots", async function() {
      utils.parseMessage.callsFake(() => ({
        command: {id: "ping"},
        isBot: true
      }))

      await messageEventHandler("foo", "bar", "baz", "qux")

      assert(!utils.sendMessage.called)
    })


    it("should run commands", async function() {
      utils.parseMessage.callsFake(() => ({
        command: {id: "ping"}
      }))

      await messageEventHandler("foo", "bar", "baz", "qux")

      assert(utils.sendMessage.calledOnce)
      assert.deepEqual(utils.sendMessage.args[0], 
        [
          "foo",
          {
            command: {id: "ping"},
            output:  "pong!"
          }
        ]
      )
    })

    it("should handle non existing commands", async function() {
      utils.parseMessage.callsFake(() => ({
        command: {id: "bar"}
      }))

      await messageEventHandler("foo", "bar", "baz", "qux")
      
      assert(!utils.sendMessage.called)
    })

  })

})