// Credit: https://discord.com/channels/119493402902528000/688773480954855537/1277099456390496308
// Credit: https://github.com/odtheking/Odin/blob/aa51c6475328a3386f6f5870f344311d2f028774/odinclient/src/main/kotlin/me/odinclient/features/impl/dungeon/CloseChest.kt#L24

import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"

const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow")

const packetOpenWindow = reg.PacketReceived((packet, event) => {
    const guiId = packet./*getGuiId()*/func_148902_e()
    const title = packet./*getWindowTitle()*/func_179840_c()./*getUnformattedText()*/func_150260_c()
    const windowId = packet./*getWindowId()*/func_148901_c()

    if (guiId !== "minecraft:chest" || (title !== "Chest" && title !== "Large Chest") || windowId < 1) return

    cancel(event)
    Client.sendPacket(new C0DPacketCloseWindow(windowId))
})
.setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)

config.registerListener("§4Auto Close Chests", state => state && location.Catacombs && !location.inDungeonBoss ? packetOpenWindow.register() : packetOpenWindow.unregister())
location.addListener(["Area", "Misc"], () => config.autoCloseChests && location.Catacombs && !location.inDungeonBoss ? packetOpenWindow.register() : packetOpenWindow.unregister())
if (config.autoCloseChests && location.Catacombs && !location.inDungeonBoss) packetOpenWindow.register()