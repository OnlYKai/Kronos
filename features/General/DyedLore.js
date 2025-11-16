import config from "../../config"
import ListFix from "../../../ListFix"

const ColorUtils = Java.type("at.hannibal2.skyhanni.utils.ColorUtils")
const ExtendedChatColor = Java.type("at.hannibal2.skyhanni.utils.ExtendedChatColor")
const skyhanniLoaded = ColorUtils.class instanceof java.lang.Class && ExtendedChatColor.class instanceof java.lang.Class

const itemTooltipEvent = register(net.minecraftforge.event.entity.player.ItemTooltipEvent, (event) => {
    const itemStack = event.itemStack
    const toolTip = event.toolTip
    if (!itemStack || !toolTip) return

    const item = itemStack./*getItem()*/func_77973_b()
    if (!(item instanceof net.minecraft.item.ItemArmor)) return
    const color = item./*getColor()*/func_82814_b(itemStack)
    if (color === -1) return
    const dyedLine = toolTip.findIndex(line => line.startsWith("§oDyed"))
    if (dyedLine === -1) return

    if (config.dyedLore === 1 || (config.dyedLore === 3 && !Client.isShiftDown())) return ListFix.removeAt(event, "toolTip", dyedLine)

    let colorStr = "#" + color.toString(16).padStart(6, "0").toUpperCase()
    if (skyhanniLoaded) colorStr = new ExtendedChatColor(ColorUtils.INSTANCE.getColorFromHex(colorStr), false).toString() + colorStr

    ListFix.set(event, "toolTip", dyedLine, `§7Color: ${colorStr}`)
})

config.registerListener("Remove/Replace 'Dyed' in Lore", state => state ? itemTooltipEvent.register() : itemTooltipEvent.unregister())
config.dyedLore ? itemTooltipEvent.register() : itemTooltipEvent.unregister()