/*
{
    ":creep:": "ԅ(≖‿≖ԅ)",
    ":cry:": "(╥﹏╥)",
    ":fight:": "(ง •̀_•́)ง",
    ":fuckoff:": "୧༼ಠ益ಠ╭∩╮༽",
    ":tears:": "(ಥ﹏ಥ)"
}
*/



/*
import { renderBoxOutline, renderTracer } from "../../Apelles"

register("renderWorld", () => {
    let [x, y, z] = [Player.getX(), Player.getY() + 1, Player.getZ() - 3]
    renderBoxOutline([1, 0, 0], x - 1, y, z, 1, 1, { lw: 7, phase: true })
    renderBoxOutline([0, 1, 0], x + 1, y, z, 1, 0.5, { lw: 7, phase: true })
    renderBoxOutline([10, 0.01, 1], x + 1, y + 1, z, 1, 0.5, { lw: 2, phase: true, chroma: true })
    renderTracer([0, 1, 0], x - 1, y+0.5, z, { lw: 10, phase: true })
})
//*/

/*
let lore = ["dsda", "dsda", "", "dsda", "dsda", "", "dsda", "dsda",]
const emptyLineIdx = lore.findIndex(line => line.removeFormatting().trim() === "")
console.log(emptyLineIdx)
lore.splice(emptyLineIdx, 0, "§aMax: §b")
console.log(lore)
//*/



// https://discord.com/channels/119493402902528000/688773480954855537/1365101448769044535
/*
import { getLerpedPosition } from "../utils/EntityUtils"
import { renderBoxOutline, renderBoxFilled } from "../../Apelles"

let mobs = []

register("step", () => {
    mobs = []
    const entities = World.getAllEntities()
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].getName() === "test") mobs.push(entities[i].getEntity())
    }
}).setFps(5)

const chroma = 1
const color = [1,0,0,1]
const chromaColors = [null, [0.3, 0.2, 0.9, 1], [10, 0.069, 0.9, 1]] // 6/360
register("renderWorld", () => {
    let c = chromaColors[chroma] ?? color
    for (let i = 0; i < mobs.length; i++) {
        let [x, y, z, w, h] = getLerpedPosition(mobs[i])
        renderBoxOutline(c, x, y, z, w, h, { lw: 3, phase: true, chroma: chroma })
    }
})
//*/



// RUNIC   ---   §5[§dLv750§5] §c§5§2Exalted Minos Inquisitor§r §d11.1M§f/§5160M§c❤
// CORRUPTED   ---   §8[§7Lv750§8] §5§ka§5Corrupted §2Exalted Minos Inquisitor§5§ka§r §e2.3M§f/§a120M§c❤

//const corrupted = World.getAllEntities().filter(e => e.entity.func_95999_t()?.includes("Corrupted")).forEach(e => console.log(e.entity.func_95999_t()))



/*
import showTitle from "../utils/Title"
register("command", (arg) => {
    if (arg === "vanilla") Client.showTitle("TestqQ", "vanilla", 0, 40, 0)
    else if (arg === "custom") showTitle("TestqQ", "custom", 2000)
}).setName("title").setTabCompletions(["vanilla", "custom"])
//*/

/*
import hudManager from "../hudManager"
const hud = hudManager.createTextHud("TEST", 1, 1, true, true, { scale: 2, centered: true, text: "", icons: [] })
hud.setText("Leck\nMeine\nEier")
hud.setIcons([new Item("minecraft:cake"), null, new Item(1)])
//*/

//const hasHaste = () => Player.getActivePotionEffects().find(effect => effect.getName() === "potion.digSpeed" && effect.getAmplifier() >= 2)
//console.log(hasHaste())

/*
console.log(net.minecraft.init.Blocks.field_150486_ae.registryName)
console.log(net.minecraft.init.Blocks.field_150447_bR.registryName)
console.log(net.minecraft.init.Blocks.field_150465_bP.registryName)
console.log(net.minecraft.init.Blocks.field_150442_at.registryName)
console.log(net.minecraft.init.Blocks.field_150430_aB.registryName)
console.log(net.minecraft.init.Blocks.field_150471_bO.registryName)
*/

//register("blockBreak", () => console.log("BLOCK BREAK"))
//register("hitBlock", () => console.log("HIT BLOCK"))



/*
import reg from "../utils/Register"
import showTitle from "../utils/Title"

reg.EntityJoinWorld((event) => {
    const entity = event.entity
    if (!(entity instanceof net.minecraft.entity.item.EntityArmorStand && entity.func_95999_t().includes("Revive Stone"))) return
    showTitle("§b§l[§9§l§kO§b§l] Revive Stone §b§l[§9§l§kO§b§l]", "", 3000)
    new Sound({ source: "chime.ogg", priority: true })?.play()
})
.triggerAllEntitiesOnRegister(true)
.register()

reg.EntityJoinWorld((event) => {
    const entity = event.entity
    if (!(entity instanceof net.minecraft.entity.item.EntityArmorStand && entity.func_95999_t().includes("Premium Flesh"))) return
    showTitle("§b§l[§9§l§kO§b§l] Premium Flesh §b§l[§9§l§kO§b§l]", "", 3000)
    new Sound({ source: "chime.ogg", priority: true })?.play()
})
.triggerAllEntitiesOnRegister(true)
.register()
*/
