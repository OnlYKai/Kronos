import config from "../../config"
import location from "../../utils/Location"

register("chat", () => {
    if (!config.sphinxAutoAnswer || !location.Hub) return
}).setChatCriteria("[BOSS] The Watcher: That will be enough for now.")
.unregister()