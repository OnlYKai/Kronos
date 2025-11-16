import reg from "../../utils/Register"
import config from "../../config"
import { drawCenteredStringWithShadow } from "../../utils/RenderUtils"

let witherShieldTime = 0

// Wither Shield sound detection
const soundPlay = reg.SoundPlay((pos, _, vol, pitch) => {
    if (Math.abs(pos.getX() - Player.getX()) > 0.1 || Math.abs(pos.getY() - Player.getY()) > 0.1 || Math.abs(pos.getZ() - Player.getZ()) > 0.1) return
    if (vol !== 1) return
    if (pitch !== 0.6984127163887024) return
    
    witherShieldTime = Date.now()
    renderOverlay.register()
})
.setCriteria("mob.zombie.remedy")

// Timer
const renderOverlay = reg.RenderOverlay(() => {
    if (!witherShieldTime) return renderOverlay.unregister()
    let timer = 5000 - (Date.now() - witherShieldTime)
    if (timer <= 0) { timer = 0; witherShieldTime = 0 }

    if (config.witherShieldTimer === 1) drawCenteredStringWithShadow(`${(timer / 1000).toFixed(2)}s`, 2)
    else if (config.witherShieldTimer === 2) drawCenteredStringWithShadow(`${(timer / 1000).toFixed(2)}s`, 0)
})

config.registerListener("Wither Shield Timer", mode => mode ? soundPlay.register() : soundPlay.unregister())
if (config.witherShieldTimer) soundPlay.register()