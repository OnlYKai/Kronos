// Improved version of: https://github.com/zhenga8533/VolcAddons/blob/main/features/combat/RagDetect.js

import reg from "../../utils/Register"
import config from "../../config"
import showTitle from "../../utils/Title"
import { formatNumber } from "../../utils/TextUtils"
import scheduleTask from "../../utils/ServerTicks"

let chatCancelled = false
let lastMessage = undefined

const actionBar = reg.ActionBar((message, state, timer) => {
    if (chatCancelled || message === lastMessage) return
    lastMessage = message

    if (timer) return showTitle(`§l${timer}`, "", 1500)
    if (state === "CANCELLED") return showTitle("§c§lCANCELLED", "", 1500)
    
    let strength = undefined
    const heldItemSbId = Player.getHeldItem()?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("id")
    const heldItemStrength = Number(Player.getHeldItem()?.getLore()?.find(line => line.startsWith("§5§o§7Strength: "))?.removeFormatting()?.split(" ")?.[1])
    if (heldItemSbId === "RAGNAROCK_AXE" && heldItemStrength) strength = heldItemStrength * 1.5
    showTitle("§6§lAWOOGA", strength ? `§8+§f${formatNumber(strength)}§c ❁Strength` : "", 1500)
})
.setChatCriteria(/^.*((CASTING|CANCELLED)(?: IN ([1-3])s)?)$/)
.setOnRegister(() => {
    chat.register()
    worldLoad.register()
})
.setOnUnregister(() => {
    chat.unregister()
    worldLoad.unregister()
    lastMessage = undefined
    chatCancelled = false
})

const chat = reg.Chat(() => {
    chatCancelled = true
    lastMessage = "CANCELLED"
    showTitle("§c§lCANCELLED", "", 1500)
    scheduleTask(() => chatCancelled = false, 50)
})
.setChatCriteria("Ragnarock was cancelled due to taking damage!")

const worldLoad = reg.WorldLoad(() => {
    lastMessage = undefined
    chatCancelled = false
})

config.registerListener("RagAxe Alert", state => state ? actionBar.register() : actionBar.unregister())
if (config.ragAxeAlert) actionBar.register()