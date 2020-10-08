const assert    = require("assert")
const sinon     = require("sinon")
const weatherJS = require("weather-js")
const DiscordJS = require("discord.js")

const weatherCommand = require("../../lib/commands/weather")

describe("commands/weather()", function() {

  let settings, profiles, weatherData, discordOutput

  before(async function() {
    settings = {
      color: "#FF0000",
      prefix: "??"
    }

    profiles = [
      {id: "1234", location: "foo bar"}
    ]

    sinon.stub(weatherJS, "find").callsFake((input, cb) => {cb(undefined, weatherData)})
    sinon.stub(console, "error").callsFake(() => { /* be quiet*/ })
  })

  after(function() {
    sinon.restore()
  })

  beforeEach(function() {
    weatherJS.find.resetHistory()

    weatherData = [
      {
        location: {
          name: "FooBar"
        },
        current: {
          day:             "foo",
          observationtime: "bar",
          skytext:         "baz",
          imageUrl:        "foo.bar",
          windspeed:       "0 km/h",
          winddisplay:     "64 km/h southeast",
          temperature:     16,
          feelslike:       0,
        },
        forecast: [
          {},
          {
            day:        "qux",
            skytextday: "quux",
            low:        -20,
            high:       30,
            precip:     "50"
          }
        ]
      }
    ]

    discordOutput = new DiscordJS.MessageEmbed()

    discordOutput.setAuthor("Weather report for FooBar", "foo.bar")
    discordOutput.setColor(16711680)

    discordOutput.addField("foo bar",            "baz",                      false)
    discordOutput.addField("Temp",               "16°C/60°F",                true)
    discordOutput.addField("Feels like",         "0°C/32°F",                 true)
    discordOutput.addField("Wind",               "18m/s or 40mph southeast", true)
    discordOutput.addField("qux forecast",       "quux",                     false)
    discordOutput.addField("Temp low",           "-20°C/-4°F",               true)
    discordOutput.addField("Temp high",          "30°C/86°F",                true)
    discordOutput.addField("Precip probability", "50%",                      true)

    discordOutput.setFooter("Weather report provided by Microsoft")
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(weatherCommand, {
      id:   "weather",
      args: [
       [],
       ["<location>"],
       ["@username"]
      ],
      run: weatherCommand.run
    })
  })

  it("should output a weather report for a location", async function() {
    let message = {
      command:  {args: ["bar", "foo"]},
      author:   {id:"1234", username: "foobar"},
      mentions: []
    }

    const expected = {
      command:  {args: ["bar", "foo"]},
      mentions: [],
      author:   {id:"1234", username: "foobar"},
      isReply: false,
      output:  discordOutput
    }
    
    // weatherData[0].current.winddisplay = "64 km/h"
    // expected[1].output.fields[3].value = "18m/s or 40mph "

    message = await weatherCommand.run({message, settings, profiles})

    assert.deepEqual(weatherJS.find.args[0][0], {search: "bar foo", degreeType: 'C'})
    assert.deepEqual(message, expected)
  })

  it("should output a weather report for the author", async function() {
    const messages = [
      {author: {id: 1234, username: "FooBar"}, command:{args: []}, mentions: []},
      {author: {id: 4321, username: "FooBaz"}, command:{args: []}, mentions: []},
      {author: {id: 5678, username: "FooQux"}, command:{args: []}, mentions: []}
    ]

    const expected = [
      {
        author:  {id: 1234, username: "FooBar"},
        command: {args: []},
        mentions: [],
        isReply: false,
        output:  discordOutput
      },
      {
        author:  {id: 4321, username: "FooBaz"},
        command: {args: []},
        mentions: [],
        isReply: true,
        output:  "Sorry, I don't have a location set for you\nUse `??location <name or zip code>` in a direct message to me to set one."
      },
      {
        author:  {id: 5678, username: "FooQux"},
        command: {args: []},
        mentions: [],
        isReply: true,
        output:  "Sorry, I don't have a location set for you\nUse `??location <name or zip code>` in a direct message to me to set one."
      }
    ]

    messages[0] = await weatherCommand.run({message: messages[0], settings, profiles})
    messages[1] = await weatherCommand.run({message: messages[1], settings, profiles})
    messages[2] = await weatherCommand.run({message: messages[2], settings, profiles})
    
    assert(weatherJS.find.calledOnce)
    assert.deepEqual(weatherJS.find.args[0][0], {search: "foo bar", degreeType: 'C'})

    assert.deepEqual(messages[0], expected[0])
    assert.deepEqual(messages[1], expected[1])
    assert.deepEqual(messages[2], expected[2])
  })

  it("should be able to get weather reports for specified users", async function() {
    let message = {
      command: {args: ["@Qux"]},
      mentions: [{id: 1234, username: "Qux"}]
    }
    
    const expected = {
      command: {args: ["@Qux"]},
      mentions: [{id: 1234, username: "Qux"}],
      isReply: false,
      output:  discordOutput
    } 

    expected.output.setAuthor("Weather report for Qux", "foo.bar")

    message = await weatherCommand.run({message, settings, profiles})
    
    assert.deepEqual(message, expected)
  })

  it("should output a specific error message if it was unable to fetch the weather data", async function() {
    let message = {
      command: {
        args: ["foo"]
      },
    }

    weatherJS.find.restore()
    sinon.stub(weatherJS, "find").callsFake((input, cb) => {cb("error")})

    message = await weatherCommand.run({message, settings, profiles})

    assert.deepEqual(message, {
      command: {
        args: ["foo"]
      },
      isReply: true,
      output: "Something went wrong 😱\nI was unable to fetch a weather report for you"
    })
  })

})