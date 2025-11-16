import config from "../../config"
import location from "../../utils/Location"
import showTitle from "../../utils/Title"



const KeyEnum = Object.freeze({
    "T1": "§9Kuudra Key",
    "T2": "§5Hot Kuudra Key",
    "T3": "§5Burning Kuudra Key",
    "T4": "§5Fiery Kuudra Key",
    "T5": "§6Infernal Kuudra Key"
})
function noKeyAlert() {
    if (!config.noKeyAlert || !location.KuudraTier) return
    if (Player.getInventory().getItems().find(item => item?.getName() === KeyEnum[location.KuudraTier])) return
    showTitle("§c§lNO KEY!", "", 3000)
    new Sound({ source: "attention.ogg", priority: true })?.play()
}
location.addListener("Misc", noKeyAlert)
register("chat", noKeyAlert).setChatCriteria("Starting in ${*} seconds.")
//.setChatCriteria("WARNING: You do not have a key for this tier in your inventory, you will not be able to claim rewards.")



register("chat", () => {
    if (!config.stunnedAlert || !location.Kuudra) return
    showTitle("§a§lSTUNNED!", "", 1500)
    new Sound({ source: "music.ogg", priority: true })?.play()
}).setChatCriteria(/[a-zA-Z0-9_]+ destroyed one of Kuudra's pods!/)



// Credit: VolcAddons https://github.com/zhenga8533/VolcAddons/blob/main/features/kuudra/KuudraAlerts.js#L149
const EntityGhast = Java.type("net.minecraft.entity.monster.EntityGhast")
const dropshipAlert = register("step", () => {
    const dropship = World.getAllEntitiesOfType(EntityGhast.class).find(ghast => {
        const distance = Math.hypot(ghast.getX() + 101, ghast.getZ() + 105)
        return distance < 20 && distance > 10
    })
    if (!dropship) return
    showTitle("§4§lART IS AN EXPLOSION!", "", 2500)
    new Sound({ source: "attention.ogg", priority: true })?.play()
}).unregister()
.setFps(1)

config.registerListener("Dropship Alert", state => state && location.Kuudra ? dropshipAlert.register() : dropshipAlert.unregister())
location.addListener("Area", () => config.dropshipAlert && location.Kuudra ? dropshipAlert.register() : dropshipAlert.unregister())
if (config.dropshipAlert && location.Kuudra) dropshipAlert.register()