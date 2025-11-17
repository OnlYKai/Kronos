import config from "../../config"
import location from "../../utils/Location"
import showTitle from "../../utils/Title"

register("chat", () => {
    if (!config.witherKeyAlert || !location.Catacombs) return
    showTitle("§c§lKEY PICKED!", "", 1500)
    new Sound({ source: "attention.ogg", priority: true })?.play()
}).setChatCriteria("${player} has obtained ${key} Key!")

register("chat", () => {
    if (!config.bloodSpawnedAlert || !location.Catacombs) return
    showTitle("§c§lSPAWNED!", "", 1500)
    new Sound({ source: "attention.ogg", priority: true })?.play()
}).setChatCriteria("[BOSS] The Watcher: That will be enough for now.")

register("chat", () => {
    if (!config.bloodClearedAlert || !location.Catacombs) return
    showTitle("§a§lCLEARED!", "", 1500)
    new Sound({ source: "attention.ogg", priority: true })?.play()
}).setChatCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")