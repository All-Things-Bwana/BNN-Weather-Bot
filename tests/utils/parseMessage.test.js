const assert = require("assert")
const sinon  = require("sinon")

const parseMessage = require("../../lib/utils/parseMessage")

describe("utils/parseMessage()", function() {

  let bot, settings

  before(function() {
    bot = {
      user: {
        username: "foo"
      }
    }
    
    settings = {
      prefix: "??"
    }

    sinon.stub(console, "error").callsFake(() => { /* be quiet */ })
  })

  after(function() {
    sinon.restore()
  })

  it("should return a message object no matter what", function() {
    const message = parseMessage(bot, undefined, undefined)

    const expected = {
      input:       '',
      timestamp:   0,
      mentions:    [],
      isMentioned: false,
      isReply:     false,
      isBot:       false,
      isDM:        false,
      author:      {username: ''},
      self:        {username: 'foo'},
      original:    undefined
    }

    assert.deepEqual(message, expected)
  })

  describe("Discord", function() {

    const discordMessage = {
      cleanContent:     '',
      id:               1111,
      createdTimestamp: 2,
      author:           {username: "bar"},
      channel:          {type: "text"},
      member: {
        guild: {
          ownerID: "2222"
        },
        user: {
          id: "3333"
        }
      }
    }

    const expectedTemplate = {
      input:       '',
      timestamp:   2,
      mentions:    [],
      isMentioned: false,
      isReply:     false,
      isBot:       false,
      isDM:        false,
      author:      {username: 'bar'},
      self:        {username: 'foo'},
      original:    Object.assign({}, discordMessage)
    } 

    it("should parse messages", function() {
      const message = parseMessage(bot, settings, discordMessage)

      assert.deepEqual(message, expectedTemplate)
    })

    it("should parse commands", function() {
      const data     = Object.assign({}, discordMessage)
      const expected = Object.assign({}, expectedTemplate)

      data.cleanContent = "??foo bar baz"

      expected.input    = "??foo bar baz"
      expected.author   = {username: "bar"}
      expected.command  = {id: "foo", args: ["bar", "baz"]}
      expected.original = data

      const message  = parseMessage(bot, settings, data)

      assert.deepEqual(message, expected)
    })

    it("should parse mentions", function() {
      const data     = Object.assign({}, discordMessage)
      const expected = Object.assign({}, expectedTemplate)

      data.mentions = {users: [{id: 1234, username: "FooBar"}]}
      
      expected.mentions = [{id: 1234, username: "FooBar"}]
      expected.original = data

      const message  = parseMessage(bot, settings, data)
      
      assert.deepEqual(message, expected)
    })

    it("should detect if the message is from a bot", function() {
      const data     = Object.assign({}, discordMessage)
      const expected = Object.assign({}, expectedTemplate)

      data.author = {username: "Foo"}

      expected.isBot    =  true
      expected.author   = {username: 'Foo'}
      expected.original = data

      const message = parseMessage(bot, settings, data)

      assert.deepEqual(message, expected)
    })

    it("should detect if the message is a direct message", function() {
      const data     = Object.assign({}, discordMessage)
      const expected = Object.assign({}, expectedTemplate)

      data.channel = {type: "dm"}

      expected.isDM     = true
      expected.original = data

      const message = parseMessage(bot, settings, data)

      assert.deepEqual(message, expected)
    })

    it("should handle missing member reference", function() {
      const data     = Object.assign({}, discordMessage)
      const expected = Object.assign({}, expectedTemplate)
      
      data.member              = null
      expected.original.member = null
            
      const message = parseMessage(bot, settings, data)

      assert.deepEqual(message, expected)
    })

  })

})