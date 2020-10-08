const path = require("path")
const fs   = require("fs")

function saveData({ settings, profiles }) {

  if (!settings && !profiles)
    return

  console.log(`Saving ${settings && profiles ? "settings and profiles" : `${settings ? "settings" : "profiles"}`}`)

  if (settings) {
    const filePath = path.resolve(__dirname, "../../settings.json")
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 3)) 
  }

  if (profiles) {
    const filePath = path.resolve(__dirname, "../../profiles.json")
    fs.writeFileSync(filePath, JSON.stringify(profiles, null, 3)) 
  }
  
}

module.exports = saveData