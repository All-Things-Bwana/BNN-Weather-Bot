const assert = require("assert")
const sinon  = require("sinon")

const errorEventHandler = require("../../lib/events/error")

describe("events/error()", function() {

  before(function() {
    sinon.stub(console, "error")
  })

  after(function() {
    sinon.restore()
  })

  it("should log errors", function() {
    const err = new Error("foobar")

    errorEventHandler(err)

    assert.deepEqual(console.error.args[0][0], err)
  })

})