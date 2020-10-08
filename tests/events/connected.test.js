const assert = require("assert")
const sinon  = require("sinon")

const connectedEventHandler = require("../../lib/events/connected")

describe("events/connected()", function() {

  before(function() {
    sinon.stub(console, "log")

    connectedEventHandler()
  })

  after(function() {
    sinon.restore()
  })

  it("should log connections", function() {
    assert.deepEqual(console.log.args[0][0], "Discord connected")
  })

})