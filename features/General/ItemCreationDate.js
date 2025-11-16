import reg from "../../utils/Register"
import config from "../../config"
import ListFix from "../../../ListFix"
import { getTimestamp } from "../../utils/ItemUtils"

const DurationFormatUtils = Java.type("org.apache.commons.lang3.time.DurationFormatUtils")

const pad = (a) => a.toString().padStart(2, "0")

const itemTooltipEvent = reg.ForgeEvent(net.minecraftforge.event.entity.player.ItemTooltipEvent, (event) => {
    const itemStack = event.itemStack
    const toolTip = event.toolTip
    if (!itemStack || !toolTip || !Client.isShiftDown()) return

    const timestamp = getTimestamp(itemStack)
    if (!timestamp) return

    const since = DurationFormatUtils.formatPeriod(timestamp, Date.now(), "y 'years,'M 'months,'d 'days,'H 'hours,'m 'minutes,'s 'seconds'").split(",")
    const firstValue = since.findIndex(time => !time.startsWith("0"))
    const sinceStr = since.slice(firstValue, (Math.min(firstValue+3, since.length))).join(" ")
    ListFix.add(event, "toolTip", `§7Item age: §8${sinceStr}`)

    const date = new Date(timestamp)
    const timestampStr = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    ListFix.add(event, "toolTip", `§7Timestamp: §8${timestampStr}`)
})

config.registerListener("Show Item Creation Date", state => state ? itemTooltipEvent.register() : itemTooltipEvent.unregister())
if (config.itemCreationDate) itemTooltipEvent.register()