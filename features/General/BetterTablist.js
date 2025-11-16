import config from "../../config"
import { addColor } from "../../utils/TextUtils"

const RenderGameOverlayEvent = net.minecraftforge.client.event.RenderGameOverlayEvent

const removeFromFooterRegex = /^(§[0-9a-fk-orz])*\n|\n§r§r§r§r§s§r\n§r§r§aRanks, Boosters & MORE! §r§c§lSTORE.HYPIXEL.NET§r|\n§r§r§7Use "§r§6\/effects§r§7" to see the(m| effects)!§r/g

let defaultHeader = undefined
let defaultFooter = undefined

const pre = register(RenderGameOverlayEvent.Pre, (event) => {
    if (event.type !== RenderGameOverlayEvent.ElementType.PLAYER_LIST) return
    defaultHeader = TabList.getHeader()
    defaultFooter = TabList.getFooter()
    config.betterTablistHeader ? TabList.setHeader(addColor(config.betterTablistHeader)) : TabList.clearHeader()
    if (defaultFooter) defaultFooter === "§r§aRanks, Boosters & MORE! §r§c§lSTORE.HYPIXEL.NET§r" ? TabList.clearFooter() : TabList.setFooter(defaultFooter.replace(removeFromFooterRegex, ""))
})

const post = register(RenderGameOverlayEvent.Post, (event) => {
    if (event.type === RenderGameOverlayEvent.ElementType.PLAYER_LIST) reset()
})

function reset() {
    if (defaultHeader) TabList.setHeader(defaultHeader)
    if (defaultFooter) TabList.setFooter(defaultFooter)
    defaultHeader = undefined
    defaultFooter = undefined
}

function enable() {
    pre.register()
    post.register()
}

function disable() {
    pre.unregister()
    post.unregister()
    reset()
}

register("gameUnload", reset)

config.registerListener("Better Tablist", state => state ? enable() : disable())
config.betterTablist ? enable() : disable()