const assert    = require("assert")
const sinon     = require( "sinon")

const utils           = require( "../../lib/utils")
const locationCommand = require( "../../lib/commands/location")

describe("commands/location()", function() {

  let profiles

  before(function() {
    profiles = [
      {id: "1234", location: "foo"},
      {id: "4321"}
    ]

    sinon.stub(utils, "saveData").callsFake(() => { /* ignore */ })
  })

  after(function() {
    sinon.reset()
  })

  afterEach(function() {
    utils.saveData.resetHistory()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(locationCommand, {
      id:   "location",
      args: [
        [],
        ["<location>"],
        ["remove"],
      ],
      run: locationCommand.run
    })
  })

  it("Should output the location of the user if one is set and the message is a DM", async function() {
    const messages = [
      {command: {args: []}, author: {id: "1234"}, isDM: false},
      {command: {args: []}, author: {id: "1234"}, isDM: true},
      {command: {args: []}, author: {id: "4321"}, isDM: true},
      {command: {args: []}, author: {id: "5678"}, isDM: true}
    ]

    const expected = [
      {command: {args: []}, author: {id: "1234"}, isDM: false},
      {command: {args: []}, author: {id: "1234"}, isDM: true, isReply: true, output: "Your location is set to foo"},
      {command: {args: []}, author: {id: "4321"}, isDM: true, isReply: true, output: "I don't have a location set for you yet."},
      {command: {args: []}, author: {id: "5678"}, isDM: true, isReply: true, output: "I don't have a location set for you yet."}
    ]

    const actual = [
      await locationCommand.run({message: messages[0], profiles}),
      await locationCommand.run({message: messages[1], profiles}),
      await locationCommand.run({message: messages[2], profiles}),
      await locationCommand.run({message: messages[3], profiles})
    ]

    assert.deepEqual(actual, expected)
    assert.equal(utils.saveData.args.length, 0)
  })

  it("Should set the location of the user", async function() {
    const messages = [
      {command: {args: ["foo", "bar"]},  author: {id: "1234"}, isDM: false},
      {command: {args: ["foo", "baz"]},  author: {id: "1234"}, isDM: true},
      {command: {args: ["foo", "qux"]},  author: {id: "4321"}, isDM: true},
      {command: {args: ["foo", "quux"]}, author: {id: "5678"}, isDM: true}
    ]

    const expected = [
      {command: {args: ["foo", "bar"]},  author: {id: "1234"}, isDM: false},
      {command: {args: ["foo", "baz"]},  author: {id: "1234"}, isDM: true, isReply: true, output: "Your location is now set to \"foo baz\""},
      {command: {args: ["foo", "qux"]},  author: {id: "4321"}, isDM: true, isReply: true, output: "Your location is now set to \"foo qux\""},
      {command: {args: ["foo", "quux"]}, author: {id: "5678"}, isDM: true, isReply: true, output: "Your location is now set to \"foo quux\""}
    ]

    const actual = []
    
    actual[0] = await locationCommand.run({message: messages[0], profiles})
    actual[1] = await locationCommand.run({message: messages[1], profiles})
    assert.deepEqual(utils.saveData.args[0][0], {profiles})
    actual[2] = await locationCommand.run({message: messages[2], profiles})
    assert.deepEqual(utils.saveData.args[1][0], {profiles})
    actual[3] = await locationCommand.run({message: messages[3], profiles})
    assert.deepEqual(utils.saveData.args[2][0], {profiles})
    assert.equal(utils.saveData.args.length, 3)

    assert.deepEqual(actual, expected)
  
    assert.deepEqual(profiles, [
      {id: "1234", location: "foo baz"},
      {id: "4321", location: "foo qux"},
      {id: "5678", location: "foo quux"}
    ])
  })
  
  it("Should remove the location of the user", async function() {
    const messages = [
      {command: {args: ["remove"]}, author: {id: "1234"}, isDM: false},
      {command: {args: ["remove"]}, author: {id: "4321"}, isDM: true},
      {command: {args: ["RemOve"]}, author: {id: "5678"}, isDM: true},
      {command: {args: ["remove"]}, author: {id: "8765"}, isDM: true}
    ]

    const expected = [
      {command: {args: ["remove"]}, author: {id: "1234"}, isDM: false},
      {command: {args: ["remove"]}, author: {id: "4321"}, isDM: true, isReply: true, output: "Your location has been removed."},
      {command: {args: ["RemOve"]}, author: {id: "5678"}, isDM: true, isReply: true, output: "Your location has been removed."},
      {command: {args: ["remove"]}, author: {id: "8765"}, isDM: true}
    ]

    const actual = []
    actual[0] = await locationCommand.run({message: messages[0], profiles})
    actual[1] = await locationCommand.run({message: messages[1], profiles})
    assert.deepEqual(utils.saveData.args[0][0], {profiles})
    actual[2] = await locationCommand.run({message: messages[2], profiles})
    assert.deepEqual(utils.saveData.args[1][0], {profiles})
    actual[3] = await locationCommand.run({message: messages[3], profiles})
    assert.equal(utils.saveData.args.length, 2)

    assert.deepEqual(actual, expected)

    assert.deepEqual(profiles, [
      {id: "1234", location: "foo baz"},
      {id: "4321"},
      {id: "5678"}
    ])
  })

})