import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import hudManager from "../../hudManager"
import { roundTo } from "../../utils/Math"

const hud = hudManager.createTextHud("M3 Timer", 0, 245, config.M3Timer, false, { scale: 2, centered: true, fallbackText: "Freeze in: §c0.00s" })
let countdown = 0

const chat = reg.Chat(() => {
    countdown = 105
    serverTick.register()
})
.setChatCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?")
.setOnUnregister(() => serverTick.unregister())

const serverTick = reg.PacketReceived((packet) => {
    if (packet./*getActionNumber()*/func_148890_d() > 0) return
    countdown--
    if (countdown > 100) return
    hud.setText(`Freeze in: ${countdown <= 0 ? "§a" : "§c"}${Math.max(roundTo(countdown/20, 1), 0).toFixed(1)}s`)
    if (countdown <= -10 ) serverTick.unregister()
})
.setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
.setOnRegister(() => hud.setVisibility(true))
.setOnUnregister(() => {
    hud.setVisibility(false)
    hud.setText("")
    countdown = 0
})

config.registerListener("M3 Fire Freeze Timer", state => {
    hud.setEnabled(state)
    state && location.inDungeonBoss && (location.DungeonFloor === "F3" || location.DungeonFloor === "M3") ? chat.register() : chat.unregister()
})
location.addListener("Misc", () => config.M3Timer && location.inDungeonBoss && (location.DungeonFloor === "F3" || location.DungeonFloor === "M3") ? chat.register() : chat.unregister())
if (config.M3Timer && location.inDungeonBoss && (location.DungeonFloor === "F3" || location.DungeonFloor === "M3")) chat.register()