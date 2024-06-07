// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: phone-square;

//+++++++ END CONFIG ZONE ++++++++

const refreshInt = 15;
const language = 'de'
const widgetURL = 'https://pass.telekom.de'

//+++++++ END CONFIG ZONE ++++++++

let module = importModule('/Telekom Progress/telekomModule')
let wSize = config.widgetFamily
let fm = FileManager.iCloud()
let dir = fm.joinPath(fm.documentsDirectory(), 'Telekom Progress')
if (!fm.fileExists(dir)) fm.createDirectory(dir)
await module.saveImages(fm, dir)
let modulePath = fm.joinPath(dir, "telekomModule.js")
let jsonPath = fm.joinPath(dir, "telekomDataPlan.json")
if (!fm.fileExists(modulePath)) await loadModule()
let df = new DateFormatter()
    df.dateFormat = "HH:mm"
