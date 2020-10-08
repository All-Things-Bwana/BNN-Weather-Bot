const path = require("path")
const fs   = require("fs")

function loadData() {

  const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../settings.json")))
  const profiles = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../profiles.json")))

  return {
    settings,
    profiles
  }

}

module.exports = loadData