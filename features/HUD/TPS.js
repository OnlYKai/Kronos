import reg from "../../utils/Register"
import config from "../../config"
import hudManager from "../../hudManager"
import { roundTo, clamp } from "../../utils/Math"
import { addColor } from "../../utils/TextUtils"

const Instant = Java.type("java.time.Instant")

const hud = hudManager.createTextHud("TPS", 1, 10, config.tps, true, { text: addColor(`${config.tpsPrefix}${config.tpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`) })



function setTpsText(tpsNumber) {
    let tpsText = `${tpsNumber.toFixed(1)}`
    if (config.tpsPrefix.endsWith("&r")) {
        if (tpsNumber >= 15) tpsText = `§a${tpsNumber.toFixed(1)}`
        else if (tpsNumber >= 10) tpsText = `§e${tpsNumber.toFixed(1)}`
        else if (tpsNumber >= 5) tpsText = `§c${tpsNumber.toFixed(1)}`
        else tpsText = `§4${tpsNumber.toFixed(1)}`
    }
    hud.setText(addColor(`${config.tpsPrefix}${tpsText}`))
}



// This is for (the first few seconds) after joining a server until S32PacketConfirmTransaction packets are being received.
let prevTime = NaN
const S03PacketTimeUpdate = net.minecraft.network.play.server.S03PacketTimeUpdate
const packetReceivedAlt = reg.PacketReceived(() => {
    if (!worldLoadFlag) return packetReceivedAlt.unregister()

    const instant = Instant.now()
    const nowTime = instant.getEpochSecond() + instant.getNano() / 1000000000
    const tpsAlt = roundTo(clamp(20 / (nowTime - prevTime), 0, 20), 1)
    prevTime = nowTime

    isNaN(tpsAlt) ? hud.setText(addColor(`${config.tpsPrefix}${config.tpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`)) : setTpsText(tpsAlt)
})
.setFilteredClass(S03PacketTimeUpdate)
.setOnUnregister(() => prevTime = NaN)



// Same math as fast fps
let ticks = 0
let lastTickTime = NaN
const S32PacketConfirmTransaction = net.minecraft.network.play.server.S32PacketConfirmTransaction // This packet isnt being send for the first 10 seconds after joining a server, so i have to use S03PacketTimeUpdate in that time.
const packetReceived = reg.PacketReceived((packet) => {
    if (packet./*getActionNumber()*/func_148890_d() > 0) return // idk doc used this in his ServerTick module, probably filtering out some extra packets

    // Do flag stuff when the first S32PacketConfirmTransaction packet is received.
    if (worldLoadFlag === 1) { worldLoadFlag = 2; setTimeout(() => { if (worldLoadFlag === 2) worldLoadFlag = 0 }, 1000) }

    ticks++
    const instant = Instant.now()
    lastTickTime = instant.getEpochSecond() + instant.getNano() / 1000000000
})
.setFilteredClass(S32PacketConfirmTransaction)



let lastCalcTickTime = NaN
const step = reg.Step(() => {
    const tps = lastTickTime === lastCalcTickTime ? 0 : roundTo(clamp(ticks / (lastTickTime - lastCalcTickTime), 0, 20), 1) // ticks - per (/) - time in seconds since last calculation. Aka TPS
    lastCalcTickTime = lastTickTime
    ticks = 0

    if (worldLoadFlag) return // Set lastCalc etc. but dont update the text until S32PacketConfirmTransaction packets are received. tpsAlt in 'packetReceived' is used instead!

    isNaN(tps) ? hud.setText(addColor(`${config.tpsPrefix}${config.tpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`)) : setTpsText(tps)
})
.setFps(1)
.setOnRegister(() => {
    [packetReceived, worldLoad].forEach(r => r.register())
})
.setOnUnregister(() => {
    [packetReceived, worldLoad].forEach(r => r.unregister())
    ticks = 0
    lastTickTime = NaN
    lastCalcTickTime = NaN
    hud.setText(addColor(`${config.tpsPrefix}${config.tpsPrefix.endsWith("&r") ? "§a" : ""}Loading...`))
})



// This is for using S03PacketTimeUpdate until S32PacketConfirmTransaction packets are being received.
let worldLoadFlag = 0
const worldLoad = reg.WorldLoad(() => {
    useS03untilS32()
})
.setOnRegister(() => useS03untilS32())
.setOnUnregister(() => worldLoadFlag = 0)

function useS03untilS32() {
    worldLoadFlag = 1
    packetReceivedAlt.register()
}



config.registerListener("TPS", state => {
    hud.setEnabled(state)
    state ? step.register() : step.unregister()
})
if (config.tps) step.register()