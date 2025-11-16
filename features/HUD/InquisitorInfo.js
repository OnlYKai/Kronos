import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import hudManager from "../../hudManager"
import { getHpFromName } from "../../utils/EntityUtils"

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")

const hud = hudManager.createTextHud("Inquisitor HUD", 0, 245, config.inquisitorInfo, false, { scale: 2, centered: true, fallbackText: "§c§2Inquisitor§r §e0§f/§a40M§c❤ §b✯" })
let inqs = []



const entityJoin = reg.EntityJoinWorld((event) => {
    const entity = event.entity
    if (!(entity instanceof EntityArmorStand && entity./*getCustomNameTag()*/func_95999_t().includes("Exalted Minos Inquisitor"))) return

    inqs.push([entity, World.getWorld()./*getEntityByID()*/func_73045_a(entity./*getEntityId()*/func_145782_y() - 1)])
    tick.register()
})
.triggerAllEntitiesOnRegister(true)
.setOnUnregister(() => {
    inqs = []
    hud.setText("")
})



const tick = reg.Tick(() => {
    if (!inqs.length) return tick.unregister()

    inqs = inqs.filter(inq => !inq[0]./*isDead*/field_70128_L && !inq[0]./*getCustomNameTag()*/func_95999_t().includes("0§f/§"))
    const names = []
    for (let i = 0; i < inqs.length; i++) {
        let inq = inqs[i]
        let name = inq[0]./*getCustomNameTag()*/func_95999_t().replace(/§.\[§.Lv750§.\] |Exalted Minos /g, "")

        let hp = getHpFromName(name)
        if (hp && hp.current < 5_000_000 && !name.endsWith("§b✯")) World.playSound("random.orb", 1, 1)

        if (!inq[1]) inq[1] = World.getWorld()./*getEntityByID()*/func_73045_a(inq[0]./*getEntityId()*/func_145782_y() - 1)
        let damageBonus = parseInt(inq[1]?./*getCustomNameTag()*/func_95999_t()?.removeFormatting())
        if (!isNaN(damageBonus)) {
            let time = Math.round(600/8 - damageBonus/8)
            let timeText = time
            if (time < 10) timeText = `§c${timeText}`
            else if (time < 30) timeText = `§e${timeText}`
            name = `${name}§r ${timeText}s`
        }
        names.push(name)
    }
    hud.setText(names.join("\n"))
})
.setOnRegister(() => hud.setVisibility(true))
.setOnUnregister(() => hud.setVisibility(false))



config.registerListener("Inquisitor Info", state => {
    hud.setEnabled(state)
    state && location.Hub ? entityJoin.register() : entityJoin.unregister()
})
location.addListener("Area", () => config.inquisitorInfo && location.Hub ? entityJoin.register() : entityJoin.unregister())
if (config.inquisitorInfo && location.Hub) entityJoin.register()