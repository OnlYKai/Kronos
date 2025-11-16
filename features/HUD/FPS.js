import reg from "../../utils/Register"
import config from "../../config"
import hudManager from "../../hudManager"
import { addColor } from "../../utils/TextUtils"

const Instant = Java.type("java.time.Instant")

const hud = hudManager.createTextHud("FPS", 1, 1, config.fps, true, { text: addColor(`${config.fpsPrefix}${config.fpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`) })
let fps = NaN



// Credit: Soopy https://github.com/Soopyboo32/SoopyV2/blob/master/src/features/hud/index.js#L506
let frames = 0
let lastFrameTime = NaN
const renderWorld = reg.RenderWorld(() => {
    frames++
    const instant = Instant.now()
    lastFrameTime = instant.getEpochSecond() + instant.getNano() / 1000000000
})
.setOnRegister(() => {
    [worldUnload, worldLoad].forEach(r => r.register())
})
.setOnUnregister(() => {
    [worldUnload, worldLoad].forEach(r => r.unregister())
    frames = 0
    lastFrameTime = NaN
    lastCalcFrameTime = NaN
    prevFps = NaN
})



// Credit: Soopy https://github.com/Soopyboo32/SoopyV2/blob/master/src/features/hud/index.js#L540
let prevFps = NaN
let lastCalcFrameTime = NaN
const step = reg.Step(() => {
    if (config.fpsMode === 1) {
        if (lastFrameTime === lastCalcFrameTime) fps = 0
        else fps = Math.round(((frames / (lastFrameTime - lastCalcFrameTime)) + (isNaN(fps) ? (frames / (lastFrameTime - lastCalcFrameTime)) : fps) + (isNaN(prevFps) ? (frames / (lastFrameTime - lastCalcFrameTime)) : prevFps)) / 3) // frames - per (/) - time in seconds since last calculation. Aka FPS
        prevFps = fps
        lastCalcFrameTime = lastFrameTime
        frames = 0
    }
    else fps = Client.getFPS()

    if (worldLoadFlag) fps = Client.getFPS()

    if (isNaN(fps)) return hud.setText(addColor(`${config.fpsPrefix}${config.fpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`))

    let fpsText = `${fps}`
    if (config.fpsPrefix.endsWith("&r")) {
        if (fps >= 120) fpsText = `§a${fps}`
        else if (fps >= 60) fpsText = `§e${fps}`
        else if (fps >= 30) fpsText = `§c${fps}`
        else fpsText = `§4${fps}`
    }
    hud.setText(addColor(`${config.fpsPrefix}${fpsText}`))
})
.setFps(5)
.setOnRegister(() => {
    if (config.fpsMode === 1) renderWorld.register()
})
.setOnUnregister(() => {
    if (config.fpsMode === 1) renderWorld.unregister()
    fps = NaN
    hud.setText(addColor(`${config.fpsPrefix}${config.fpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`))
})



// This is to remove the 0fps drops on world load. YES THIS HAS TO BE SET IN worldUnload
let worldLoadFlag = false
const worldUnload = reg.WorldUnload(() => worldLoadFlag = true)
const worldLoad = reg.WorldLoad(() => setTimeout(() => worldLoadFlag = false, 1500))



config.registerListener("FPS", state => {
    hud.setEnabled(state)
    state ? step.register() : step.unregister()
})
config.registerListener("FPS Mode", mode => {
    if (config.fps) mode ? renderWorld.register() : renderWorld.unregister()
})
if (config.fps) step.register()