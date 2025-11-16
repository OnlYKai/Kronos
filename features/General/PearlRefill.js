import reg from "../../utils/Register"
import config from "../../config"
import { getSkyblockID } from "../../utils/ItemUtils"

let queued = false
let lastRefill = 0
let missing = 0

function refill() {
    if (missing < 1) return
    lastRefill = Date.now()
    ChatLib.command(`gfs ender_pearl ${missing}`)
}

function scheduleRefill() {
    if (missing < 1 || queued) return
    const cooldown = 1500 - (Date.now() - lastRefill)
    if (cooldown < 1) return refill()
    queued = true
    setTimeout(() => { refill(); queued = false }, cooldown)
}

const packetSetSlot = reg.PacketReceived((packet) => {
    const windowId = packet./*getWindowId()*/func_149175_c()
    const itemStack = packet./*getItem()*/func_149174_e()
    if (windowId !== 0 || getSkyblockID(itemStack) !== "ENDER_PEARL") return
    missing = 16 - itemStack./*stackSize*/field_77994_a
    scheduleRefill()
})
.setFilteredClass(net.minecraft.network.play.server.S2FPacketSetSlot)

config.registerListener("§4Auto Pearl Refill", state => state ? packetSetSlot.register() : packetSetSlot.unregister())
if (config.pearlRefill) packetSetSlot.register()