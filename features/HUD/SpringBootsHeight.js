// Credit: https://github.com/odtheking/Odin/blob/main/src/main/kotlin/me/odinmain/features/impl/dungeon/SpringBoots.kt

import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import hudManager from "../../hudManager"
import { getSkyblockID } from "../../utils/ItemUtils"

const hud = hudManager.createTextHud("Spring Boots Timer", 0, 295, config.springBootsHeight, false, { scale: 2, centered: true })
let springCounter = 0

function wearsSpringBoots() {
    return getSkyblockID(Player.getPlayer()./*getCurrentArmor()*/func_82169_q(0)) === "SPRING_BOOTS"
}

function resetCounter() {
    springCounter = 0
    hud.setVisibility(false)
    hud.setText("")
    tick.unregister()
}

const heights = [ // They seem to be a little bit off but whatever
    0.0, 3.0, 6.5, 9.0, 11.5, 13.5, 16.0, 18.0, 19.0,
    20.5, 22.5, 25.0, 26.5, 28.0, 29.0, 30.0, 31.0, 33.0,
    34.0, 35.5, 37.0, 38.0, 39.5, 40.0, 41.0, 42.5, 43.5,
    44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0,
    53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0
]
const plingPitches = new Set([0.6984127163887024, 0.8253968358039856, 0.8888888955116272, 0.9365079402923584, 1.047619104385376, 1.1746032238006592, 1.317460298538208, 1.7777777910232544])

const soundPlay = reg.PacketReceived((packet) => {
    const name = packet./*getSoundName()*/func_149212_c()
    const pitch = packet./*getPitch()*/func_149209_h()
    if (name === "random.eat" && pitch === 0.095238097012043 && wearsSpringBoots()) return resetCounter()
    if (name === "fireworks.launch" && pitch === 1.6984126567840576 && wearsSpringBoots()) return resetCounter()
    if (name === "note.pling" && plingPitches.has(pitch) && Player.isSneaking() && wearsSpringBoots()) {
        springCounter++
        const height = heights[Math.min(springCounter, heights.length - 1)]
        const color = location.inDungeonBoss && location.DungeonFloor.endsWith("7") && Player.getY() >= 220 && height >= 238 - Player.getY() ? "§a" : "§c"
        const goal = location.inDungeonBoss && location.DungeonFloor.endsWith("7") && Player.getY() >= 220 ? `§7/§a${heights.find(h => h >= 238 - Player.getY()) ?? "??"}` : ""
        hud.setText(`${color}${Math.floor(height)}${goal}`)
        hud.setVisibility(true)
        tick.register()
    }
})
.setFilteredClass(net.minecraft.network.play.server.S29PacketSoundEffect)

const tick = reg.Tick(() => { if (!Player.isSneaking() || !wearsSpringBoots()) resetCounter() })

config.registerListener("Spring Boots Height Display", state => {
    hud.setEnabled(state)
    state ? soundPlay.register() : soundPlay.unregister()
})
if (config.springBootsHeight) soundPlay.register()