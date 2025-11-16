import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import { getLerpedPosition } from "../../utils/EntityUtils"
import RenderLib from "../../../RenderLibV2J"
import { drawTracer } from "../../utils/RenderUtils"
import { chromaShader } from "../../utils/ShaderUtils"

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")



let starMobToNametagId = {}
let starMobs = {}
let shadowAssassins = {}
let witherKey = undefined
const buggedNametags = new Set([])



const step = reg.Step(() => {
    const entities = World.getAllEntities()
    const world = World.getWorld()
    const len = entities.length
    for (let i = 0; i < len; i++) {
        let entity = entities[i].getEntity()
        if (!(entity instanceof EntityArmorStand || entity instanceof EntityOtherPlayerMP)) continue
        let entityId = entity./*getEntityId()*/func_145782_y()
        if (starMobs[entityId] || shadowAssassins[entityId]) continue
        let entityName = entity./*getName()*/func_70005_c_()

        if (entity instanceof EntityArmorStand) {
            if ((config.starMobEsp || config.hideBuggedStarMobNametags) && entityName.includes("§6✯ ")) {
                let mobId = entityId - (entityName.includes("Withermancer") ? 3 : 1)
                let starMob = world./*getEntityByID()*/func_73045_a(mobId)
                if (starMob) {
                    starMobToNametagId[mobId] = entityId
                    starMobs[entityId] = starMob
                    buggedNametags.delete(entityId)
                }
                else buggedNametags.add(entityId)
            }
            else if (config.witherKeyEsp && (entityName === "§6§8Wither Key" || entityName === "§c§cBlood Key")) witherKey = entity
        }

        else if (entity instanceof EntityOtherPlayerMP) {
            if (config.shadowAssassinEsp && entityName === "Shadow Assassin") shadowAssassins[entityId] = entity
        }
    }
})
.setFps(5)
.setOnUnregister(() => {
    starMobToNametagId = {}
    starMobs = {}
    shadowAssassins = {}
    witherKey = undefined
    buggedNametags.clear()
})



const renderWorld = reg.RenderWorld(() => {
    if (config.starMobEsp) {
        if (config.starMobEspChroma) chromaShader.start()
        let [r, g, b, a] = config.starMobEspColor
        for (let key in starMobs) {
            let starMob = starMobs[key]
            if (starMob./*isDead*/field_70128_L) { delete starMobs[key]; continue }
            let [x, y, z, w, h] = getLerpedPosition(starMob)
            if (config.starMobEsp === 1) RenderLib.drawEspBoxV2(x, y, z, w, h, w, r, g, b, a, config.starMobEspPhase, 3)
            else if (config.starMobEsp === 2) RenderLib.drawInnerEspBox(x, y, z, w, h, r, g, b, a, config.starMobEspPhase)
        }
        if (config.starMobEspChroma) chromaShader.stop()
    }

    if (config.shadowAssassinEsp) {
        if (config.shadowAssassinEspChroma) chromaShader.start()
        let [r, g, b, a] = config.shadowAssassinEspColor
        for (let key in shadowAssassins) {
            let shadowAssassin = shadowAssassins[key]
            if (shadowAssassin./*isDead*/field_70128_L) { delete shadowAssassins[key]; continue }
            let [x, y, z, w, h] = getLerpedPosition(shadowAssassin)
            if (config.shadowAssassinEsp === 1) RenderLib.drawEspBoxV2(x, y, z, w, h, w, r, g, b, a, config.shadowAssassinEspPhase, 3)
            else if (config.shadowAssassinEsp === 2) RenderLib.drawInnerEspBox(x, y, z, w, h, r, g, b, a, config.shadowAssassinEspPhase)
        }
        if (config.shadowAssassinEspChroma) chromaShader.stop()
    }

    if (config.witherKeyEsp && witherKey) {
        if (witherKey./*isDead*/field_70128_L) witherKey = undefined
        else {
            if (config.witherKeyEspChroma) chromaShader.start()
            let [r, g, b, a] = config.witherKeyEspColor
            let [x, y, z, w, h] = getLerpedPosition(witherKey)
            y += 1.1, w = h = 0.7
            if (config.witherKeyEspDrawLine) drawTracer(x, y+h/2, z, r, g, b, a, config.witherKeyEspPhase, 4)
            if (config.witherKeyEsp === 1) RenderLib.drawEspBoxV2(x, y, z, w, h, w, r, g, b, a, config.witherKeyEspPhase, 4)
            else if (config.witherKeyEsp === 2) RenderLib.drawInnerEspBox(x, y, z, w, h, r, g, b, a, config.witherKeyEspPhase)
            if (config.witherKeyEspChroma) chromaShader.stop()
        }
    }
})



const renderEntity = reg.RenderEntity((entity, _, __, event) => {
    if (buggedNametags.has(entity.getEntity()./*getEntityId()*/func_145782_y())) cancel(event)
})
.setFilteredClass(net.minecraft.entity.item.EntityArmorStand)



config.registerListener("Hide Bugged Star Mob Nametags", state => {
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || config.witherKeyEsp || state) ? step.register() : step.unregister()
    location.Catacombs && !location.inDungeonBoss && (state) ? renderEntity.register() : renderEntity.unregister()
})
config.registerListener("Star Mob ESP", state => {
    location.Catacombs && !location.inDungeonBoss && (state || config.shadowAssassinEsp || config.witherKeyEsp || config.hideBuggedStarMobNametags) ? step.register() : step.unregister()
    location.Catacombs && !location.inDungeonBoss && (state || config.shadowAssassinEsp || config.witherKeyEsp) ? renderWorld.register() : renderWorld.unregister()
})
config.registerListener("Shadow Assassin ESP", state => {
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || state || config.witherKeyEsp || config.hideBuggedStarMobNametags) ? step.register() : step.unregister()
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || state || config.witherKeyEsp) ? renderWorld.register() : renderWorld.unregister()
})
config.registerListener("Wither/Blood Key ESP", state => {
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || state || config.hideBuggedStarMobNametags) ? step.register() : step.unregister()
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || state) ? renderWorld.register() : renderWorld.unregister()
})
location.addListener(["Area", "Misc"], () => {
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || config.witherKeyEsp || config.hideBuggedStarMobNametags) ? step.register() : step.unregister()
    location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || config.witherKeyEsp) ? renderWorld.register() : renderWorld.unregister()
    location.Catacombs && !location.inDungeonBoss && (config.hideBuggedStarMobNametags) ? renderEntity.register() : renderEntity.unregister()
})
if (location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || config.witherKeyEsp || config.hideBuggedStarMobNametags)) step.register()
if (location.Catacombs && !location.inDungeonBoss && (config.starMobEsp || config.shadowAssassinEsp || config.witherKeyEsp)) renderWorld.register()
if (location.Catacombs && !location.inDungeonBoss && (config.hideBuggedStarMobNametags)) renderEntity.register()