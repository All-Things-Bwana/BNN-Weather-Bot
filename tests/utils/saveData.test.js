const assert = require("assert")
const sinon  = require("sinon")
const path   = require("path")
const fs     = require("fs")

const saveData = require("../../lib/utils/saveData")

describe("utils/saveData()", function() {

  const settings = {
    foo: "bar"
  }

  const profiles = {
    bar: "baz",
    baz: {
      qux: "quux",
      quux: ["foo", "bar"]
    }
  }

  before(function() {
    sinon.stub(path, "resolve").returns("foo.bar")
    sinon.stub(fs, "writeFileSync").callsFake(() => undefined)
    sinon.stub(console, "log")
  })

  after(function() {
    sinon.restore()
  })

  it("should save the data to a JSON file", function() {
    saveData({ settings })
    saveData({ profiles })
    saveData({ settings, profiles })

    assert.deepEqual(console.log.args, [
      ["Saving settings"],
      ["Saving profiles"],
      ["Saving settings and profiles"]
    ])
    
    assert.deepEqual(path.resolve.args, [
      [__dirname.replace("tests", "lib"), "../../settings.json"],
      [__dirname.replace("tests", "lib"), "../../profiles.json"],
      [__dirname.replace("tests", "lib"), "../../settings.json"],
      [__dirname.replace("tests", "lib"), "../../profiles.json"]
    ])

    assert.deepEqual(fs.writeFileSync.args, [
      ["foo.bar", JSON.stringify(settings, null, 3)],
      ["foo.bar", JSON.stringify(profiles, null, 3)],
      ["foo.bar", JSON.stringify(settings, null, 3)],
      ["foo.bar", JSON.stringify(profiles, null, 3)]
    ])

  })

})