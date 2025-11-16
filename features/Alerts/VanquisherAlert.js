import config from "../../config"
import location from "../../utils/Location"
import showTitle from "../../utils/Title"

const S45PacketTitle = net.minecraft.network.play.server.S45PacketTitle
const vanquisherAlert = register("packetReceived", (packet, event) => {
    if (packet./*getType()*/func_179807_a() !== S45PacketTitle.Type.TITLE) return
    const titleComponent = packet./*getMessage()*/func_179805_b()
    if (!titleComponent || new TextComponent(titleComponent).getText().removeFormatting() !== ("VANQUISHER")) return
    cancel(event)
    showTitle("§5§l[§b§l§kO§5§l] VANQUISHER §5§l[§b§l§kO§5§l]", "", 2000)
}).unregister()
.setFilteredClass(S45PacketTitle)

config.registerListener("Vanquisher Alert", state => state && location.CrimsonIsle ? vanquisherAlert.register() : vanquisherAlert.unregister())
location.addListener("Area", () => config.vanquisherAlert && location.CrimsonIsle ? vanquisherAlert.register() : vanquisherAlert.unregister())
if (config.vanquisherAlert && location.CrimsonIsle) vanquisherAlert.register()