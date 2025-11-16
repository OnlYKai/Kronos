import reg from "../../utils/Register"
import config from "../../config"
import ListFix from "../../../ListFix"
import { formatNumberAbbr } from "../../utils/TextUtils"

const itemTooltipEvent = reg.ForgeEvent(net.minecraftforge.event.entity.player.ItemTooltipEvent, (event) => {
    const itemStack = event.itemStack
    const toolTip = event.toolTip
    if (!itemStack || !toolTip) return

    const amount = itemStack./*stackSize*/field_77994_a
    if (amount < 2) return

    const priceLine = toolTip.findIndex(line => line.startsWith("§5§o§7Buy it now: ") || line.startsWith("§5§o§7Sold for: ") || line.startsWith("§5§o§7Starting bid: ") || line.startsWith("§5§o§7Top bid: "))
    if (priceLine === -1) return
    const price = toolTip[priceLine].match(/^§5§o§7.+: §6(.+) coins$/)?.[1]?.replaceAll(",", "")

    const pricePerStr = ` §e(${formatNumberAbbr(price/amount)} each)`
    ListFix.set(event, "toolTip", priceLine, toolTip[priceLine] + pricePerStr)
})

config.registerListener("Show Price Per Item", state => state ? itemTooltipEvent.register() : itemTooltipEvent.unregister())
if (config.pricePerItem) itemTooltipEvent.register()