import config from "../../config"

register("messageSent", (message, event) => {
    if (!config.warpTomb) return
    message = message.toLocaleLowerCase().replaceAll(" ", "")
    if (message !== "/warptomb" && !(config.warpTomb === 2 && message === "/tomb")) return
    cancel(event)
    ChatLib.say("/warp smold")
})