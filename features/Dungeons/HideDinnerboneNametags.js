import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"

const renderNametag = reg.ForgeEvent(net.minecraftforge.client.event.RenderLivingEvent.Specials.Pre, (event) => {
    if (event.entity./*getCustomNameTag()*/func_95999_t() === "Dinnerbone") cancel(event)
})

config.registerListener("Hide Dinnerbone Nametags", state => state && location.Catacombs && !location.inDungeonBoss ? renderNametag.register() : renderNametag.unregister())
location.addListener(["Area", "Misc"], () => config.hideDinnerboneNametags && location.Catacombs && !location.inDungeonBoss ? renderNametag.register() : renderNametag.unregister())
if (config.hideDinnerboneNametags && location.Catacombs && !location.inDungeonBoss) renderNametag.register()