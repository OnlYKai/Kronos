import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import hudManager from "../../hudManager"
import { roundTo } from "../../utils/Math"

let boss = undefined

const step = reg.Step(() => {
    if (boss) return
    const armorstands = World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand)
    const world = World.getWorld()
    const spawnedByName = `Spawned by: ${Player.getName()}`
    const len = armorstands.length
    for (let i = 0; i < len; i++) {
        let armorstand = armorstands[i].getEntity()

        let armorstandName = armorstand./*getCustomNameTag()*/func_95999_t()
        //ChatLib.chat(armorstandName)
        if (!armorstandName.startsWith("§5⊙ §c☠ §bVoidgloom Seraph ")) continue

        let armorstandId = armorstand./*getEntityId()*/func_145782_y()

        let spawnedBy = world./*getEntityByID()*/func_73045_a(armorstandId + 2)?./*getCustomNameTag()*/func_95999_t()?.removeFormatting()
        if (spawnedBy !== spawnedByName) continue

        let mob = world./*getEntityByID()*/func_73045_a(armorstandId - 1)
        let timer = world./*getEntityByID()*/func_73045_a(armorstandId + 1)
        if (!mob || !timer) continue

        boss = {
            name: armorstand,
            mob,
            timer
        }
        start()
    }
})
.setFps(5)
.setOnUnregister(reset)



const laserHud = hudManager.createTextHud("Laser Timer", 0, 295, config.voidgloomLaserTimer, false, { scale: 2, centered: true })

const tick = reg.Tick(() => {
    if (boss.mob./*isDead*/field_70128_L) return reset()

    // Credit: https://github.com/hannibal002/SkyHanni/blob/8e336671d1d001a13c59c0edc8bb221c66d95bbc/src/main/java/at/hannibal2/skyhanni/features/combat/damageindicator/DamageIndicatorManager.kt#L745
    if (config.voidgloomLaserTimer) {
        let ridingEntity = boss.mob./*ridingEntity*/field_70154_o
        if (ridingEntity) laserHud.setText(`§a§l${Math.max(roundTo((163 - ridingEntity./*ticksExisted*/field_70173_aa) / 20, 1), 0).toFixed(1)}s`)
        else laserHud.setText("")
    }
})



function start() {
    tick.register()
    laserHud.setVisibility(true)
}

function reset() {
    tick.unregister()
    boss = undefined
    laserHud.setVisibility(false)
    laserHud.setText("")
}



config.registerListener("Laser Timer", state => laserHud.setEnabled(state))
config.registerListener("Laser Timer", state => location.TheEnd && (state) ? step.register() : step.unregister())

location.addListener("Area", () => location.TheEnd && (config.voidgloomLaserTimer) ? step.register() : step.unregister())
if (location.TheEnd && (config.voidgloomLaserTimer)) step.register()