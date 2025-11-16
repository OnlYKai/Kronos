import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import showTitle from "../../utils/Title"



register("chat", (player) => {
    if (!config.phoenixAlert) return
    if (player !== Player.getName()) return console.log("Phoenix diff player! Drop: ", player, " Self: ", Player.getName())
    showTitle("§c§l[§e§l§kO§c§l] Phoenix §c§l[§e§l§kO§c§l]", "", 4500)
    new Sound({ source: "roll.ogg", priority: true })?.play()
})
.setChatCriteria("Wow! ${player} found a Phoenix pet!")



const iceSprayAlert = reg.EntityJoinWorld((event) => {
    const entity = event.entity
    if (!(entity instanceof net.minecraft.entity.item.EntityArmorStand && entity./*getCustomNameTag()*/func_95999_t().includes("Ice Spray Wand"))) return
    showTitle("§b§l[§9§l§kO§b§l] Ice Spray Wand §b§l[§9§l§kO§b§l]", "", 3000)
    new Sound({ source: "chime.ogg", priority: true })?.play()
})
.triggerAllEntitiesOnRegister(true)

config.registerListener("Ice Spray Alert", state => state && location.Catacombs && !location.inDungeonBoss ? iceSprayAlert.register() : iceSprayAlert.unregister())
location.addListener(["Area", "Misc"], () => config.iceSprayAlert && location.Catacombs && !location.inDungeonBoss ? iceSprayAlert.register() : iceSprayAlert.unregister())
if (config.iceSprayAlert && location.Catacombs && !location.inDungeonBoss) iceSprayAlert.register()



register("chat", (player, dye, edition) => {
    if (!config.dyeAlert) return
    if (player !== Player.getName()) return console.log("Dye diff player! Drop: ", player, " Self: ", Player.getName())
    showTitle(dye, edition ?? "", 4500)
    new Sound({ source: "roll.ogg", priority: true })?.play()
})
//.setChatCriteria(/WOW! (?:\[[A-Z+]+\] )?([a-zA-Z0-9_]+) found ([a-zA-Z]+ Dye)(?: (#\d+))?!/)
.setChatCriteria(/&r&d&lWOW! (?:&r&.\[[A-Z]+(?:&r&.\+&r&.)?\] )?(?:&r)?(?:&.)?([a-zA-Z0-9_]+)&r&f &r&6found &r(&.[a-zA-Z]+ Dye)(?: &r(&8#\d+))?&r&6!&r/).setContains()

// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&bAquamarine Dye &r&8#95&r&6!&r
// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&3Iceberg Dye&r
// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&4Carmine Dye&r
// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&5Midnight Dye&r
// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&6Treasure Dye&r
// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&3Periwinkle Dye&r
// &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&fBone Dye&r

// §r§d§lWOW! §r§b[MVP] BlubbiFischi§r§f §r§6found §r§6Mango Dye§r§6!§r



register("chat", (drop, mf) => {
    if (!config.rareSlayerDropAlert) return
    showTitle(drop, mf ? "§b"+mf : "", 3000)
    World.playSound("note.pling", 1, 4)
})
//.setChatCriteria(/(?:CRAZY RARE|INSANE) DROP! \((.+?)\)(?: \((\+\d+% ✯) Magic Find\))?/)
.setChatCriteria(/&r&.&l(?:CRAZY RARE|INSANE) DROP! &r&7\(&r(&..+)&r&7\)(?: &r&b\((\+\d+% &r&b✯) Magic Find&r&b\))?&r/)

// &r&d&lCRAZY RARE DROP! &r&7(&r&5Smite VII&r&7) &r&b(+194% &r&b✯ Magic Find&r&b)&r