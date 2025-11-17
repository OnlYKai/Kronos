import config from "../../config"
import location from "../../utils/Location"

register("chat", () => {
    if (!config.sphinxAutoAnswer || !location.Hub) return
}).setChatCriteria("Sphinx")
.unregister()