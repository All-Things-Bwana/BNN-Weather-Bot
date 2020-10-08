const assert    = require("assert")
const sinon     = require( "sinon")

const helpCommand = require( "../../lib/commands/help")

describe("commands/help()", function() {

  let settings

  before(function() {
    settings = {
      prefix: "??"
    }
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(helpCommand, {
      id: "help",
      args:         [
        [],
        ["<command>"]
      ],
      run: helpCommand.run
    })
  })

  it("Should output a list of commands", async function() {
    const message = {
      command: {args: []}
    }

    const expected = {
      command: {args: []},
      output: "Available commands are:\n??help ??ping ??location ??weather"
    }

    const actual = await helpCommand.run({message, settings})

    assert.deepEqual(expected, actual)
  })

  it("should output the available arguments for a command", async function() {
    const messages = [
      {command: {args: ["ping"]}},
      {command: {args: ["??ping"]}},
      {command: {args: ["location"]}},
      {command: {args: ["foobar"]}},
    ]

    const expected = [
      {command: {args: ["ping"]},     output: "Usages for `??ping`\n`??ping `"},
      {command: {args: ["??ping"]},   output: "Usages for `??ping`\n`??ping `"},
      {command: {args: ["location"]}, output: "Usages for `??location`\n`??location `\n`??location <location>`\n`??location remove`"},
      {command: {args: ["foobar"]},   output: "The command `foobar` does not exist."},
    ]

    const actual = [
      await helpCommand.run({message: messages[0], settings}),
      await helpCommand.run({message: messages[1], settings}),
      await helpCommand.run({message: messages[2], settings}),
      await helpCommand.run({message: messages[3], settings}),
    ]

    assert.deepEqual(expected, actual)
  })

})