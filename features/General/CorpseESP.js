import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import { renderWaypoint } from "../../utils/RenderUtils"
import { noSqrt3DDistance } from "../../utils/EntityUtils"

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")

let detected = {}
const claimed = new Set([])



const HelmetTypes = Object.freeze({
    "Lapis Armor Helmet": { color: [0, 0, 1], name: "Lapis" },
    "Mineral Helmet": { color: [1, 1, 1], name: "Tungsten" },
    "Yog Helmet": { color: [181/255, 98/255, 34/255], name: "Umber" },
    "Vanguard Helmet": { color: [242/255, 36/255, 184/255], name: "Vanguard" }
})
const tick = reg.Tick(() => {
    const armorstands = World.getAllEntitiesOfType(EntityArmorStand.class)
    for (let i = 0; i < armorstands.length; i++) {
        let armorstand = armorstands[i]
        let armorstandId = armorstand.getEntity()./*getEntityId()*/func_145782_y()
        if (armorstand.isInvisible() || detected[armorstandId]) continue

        let helmet = new EntityLivingBase(armorstand.getEntity()).getItemInSlot(4)?.getName()?.removeFormatting()
        let type = HelmetTypes[helmet]
        if (type) detected[armorstandId] = { color: type.color, x: armorstand.getX(), y: armorstand.getY()+1, z: armorstand.getZ(), type: type.name }
    }
})
.setOnRegister(() => [renderWorld, chat, packetReceived].forEach(r => r.register()))
.setOnUnregister(() => {
    [renderWorld, chat, packetReceived].forEach(r => r.unregister())
    detected = {}
})



const renderWorld = reg.RenderWorld(() => {
    for (let key in detected) {
        let corpse = detected[key]
        let [r, g, b] = corpse.color
        if (!claimed.has(key)) renderWaypoint(corpse.x, corpse.y, corpse.z, r, g, b, { w: 0.8, h: 0.8, text: corpse.type, phase: true })
    }
})



const LootedTypes = Object.freeze({
    "LAPIS": "Lapis Armor Helmet",
    "TUNGSTEN": "Mineral Helmet",
    "UMBER": "Yog Helmet",
    "VANGUARD": "Vanguard Helmet"
})
const chat = reg.Chat((type) => {
    const corpses = World.getAllEntitiesOfType(EntityArmorStand.class)
        .filter(entity => !entity.isInvisible() && !claimed.has(entity.getEntity()./*getEntityId()*/func_145782_y()) && new EntityLivingBase(entity.getEntity()).getItemInSlot(4)?.getName()?.removeFormatting() === LootedTypes[type])
        .sort((a, b) => noSqrt3DDistance(a.getEntity(), Player.getPlayer()) - noSqrt3DDistance(b.getEntity(), Player.getPlayer()))
    if (!corpses.length) return
    const entity = corpses[0]
    claimed.add(entity.getEntity()./*getEntityId()*/func_145782_y().toString())
    ChatLib.say(`/pc x: ${Math.round(entity.getX())}, y: ${Math.round(entity.getY()+1)}, z: ${Math.round(entity.getZ())} | ${type}`)
})
.setChatCriteria(/  ([A-Z]+) CORPSE LOOT! /)
.setOnUnregister(() => claimed.clear())



const packetReceived = reg.PacketReceived((packet, event) => {
    if (packet./*getType()*/func_179841_c() !== 0) return
    const message = packet./*getChatComponent()*/func_148915_c()./*getUnformattedText()*/func_150260_c()?.removeFormatting()
    if (/: x: -?[\d\.]+, y: -?[\d\.]+, z: -?[\d\.]+ \| /.test(message)) cancel(event)
})
.setFilteredClass(net.minecraft.network.play.server.S02PacketChat)



config.registerListener("§4Corpse ESP", state => state && location.Mineshaft ? tick.register() : tick.unregister())
location.addListener("Area", () => config.corpseEsp && location.Mineshaft ? tick.register() : tick.unregister())
if (config.corpseEsp && location.Mineshaft) tick.register()