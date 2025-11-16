import reg from "../../utils/Register"
import config from "../../config"
import ListFix from "../../../ListFix"
import { getExtraAttributes } from "../../utils/ItemUtils"

const itemTooltipEvent = reg.ForgeEvent(net.minecraftforge.event.entity.player.ItemTooltipEvent, (event) => {
    const itemStack = event.itemStack
    const toolTip = event.toolTip
    if (!itemStack || !toolTip) return

    const gearScoreLine = toolTip.findIndex(line => line.startsWith("§5§o§7Gear Score: "))
    if (gearScoreLine === -1) return

    const nbt = getExtraAttributes(itemStack)
    if (!nbt) return

    if (!nbt.rawNBT./*hasKey()*/func_74764_b("item_tier")) return ListFix.removeAt(event, "toolTip", gearScoreLine)
    const quality = nbt.getInteger("baseStatBoostPercentage")
    const tier = nbt.getInteger("item_tier")
    const req = nbt.getString("dungeon_skill_req")?.split(":")?.[1]
    // Requirement calculation from Syktils: https://github.com/Skytils/SkytilsMod/blob/1.x/src/main/kotlin/gg/skytils/skytilsmod/features/impl/misc/ItemFeatures.kt#L436
    let floor = ""
    if (tier === 0) floor = "§7E"
    else if (isNaN(req) || req - tier < 20) floor = "§aF" + tier
    else floor = "§4M" + (tier-3)

    ListFix.set(event, "toolTip", gearScoreLine, `§5§o§7Item Quality: §d${quality*2}% §8(${floor}§8)`)
})

config.registerListener("Show Item Quality and Floor", state => state ? itemTooltipEvent.register() : itemTooltipEvent.unregister())
if (config.itemQualityAndFloor) itemTooltipEvent.register()