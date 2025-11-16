// Inspired by: https://github.com/RabbitType99/NecromancyBuyHelper

import reg from "../../utils/Register"
import config from "../../config"
import ListFix from "../../../ListFix"
import { getExtraAttributes } from "../../utils/ItemUtils"

const InstanceIdToPrefix = Object.freeze({
    "catacombs_floor_one": " §8(Floor 1) ",
    "catacombs_floor_two": " §8(Floor 2) ",
    "catacombs_floor_three": " §8(Floor 3) ",
    "catacombs_floor_four": " §8(Floor 4) ",
    "catacombs_floor_five": " §8(Floor 5) ",
    "catacombs_floor_six": " §8(Floor 6) ",
    "catacombs_floor_seven": " §8(Floor 7) ",
    "master_catacombs_floor_one": " §d(Master 1) ",
    "master_catacombs_floor_two": " §d(Master 2) ",
    "master_catacombs_floor_three": " §d(Master 3) ",
    "master_catacombs_floor_four": " §d(Master 4) ",
    "master_catacombs_floor_five": " §d(Master 5) ",
    "master_catacombs_floor_six": " §d(Master 6) ",
    "master_catacombs_floor_seven": " §d(Master 7) ",
    "master_catacombs_floor_unknown": " §d(Master ?) "
})

const itemTooltip = reg.ForgeEvent(net.minecraftforge.event.entity.player.ItemTooltipEvent, (event) => {
    const itemStack = event.itemStack
    const toolTip = event.toolTip
    if (!itemStack || !toolTip) return

    let soulsLine = toolTip.findIndex(line => line.startsWith("§5§o§7Absorbed Souls:"))
    if (soulsLine === -1) return

    const item = new Item(itemStack)
    const souls = getExtraAttributes(item)?.getTagList("necromancer_souls", 10) // net.minecraftforge.common.util.Constants.NBT.TAG_COMPOUND
    const len = souls?./*tagCount()*/func_74745_c()
    if (!len) return

    for (let i = 0; i < len; i++) {
        soulsLine++
        let soul = souls./*get()*/func_179238_g(i)
        let floor = soul./*getString()*/func_74779_i("dropped_instance_id")
        if (!floor) {
            let mobId = soul./*getString()*/func_74779_i("mob_id")
            if (!mobId.startsWith("MASTER_")) continue
            floor = "master_catacombs_floor_unknown"
        }
        let name = toolTip[soulsLine]
        let splitIdx = name.indexOf(" ")
        ListFix.set(event, "toolTip", soulsLine, name.slice(0, splitIdx) + InstanceIdToPrefix[floor] + name.slice(splitIdx+1))
    }
})

config.registerListener("Show Necromancy Souls' Dungeon Floor", state => state ? itemTooltip.register() : itemTooltip.unregister())
if (config.necromancySoulsFloor) itemTooltip.register()