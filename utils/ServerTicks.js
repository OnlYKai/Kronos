let tasks = []
let worldLoadFlag = false



function triggered(alt=false) {
    for (let i = tasks.length - 1; i >= 0; i--) {
        let task = tasks[i]
        alt && task.length === 3 ? task[1] -= 20 : task[1]--
        if (alt && task.length === 2) task[2] = null
        if (task[1] > 0) continue
        task[0]()
        tasks.splice(i, 1)
    }

    if (!tasks.length) {
        trigger.unregister()
        triggerAlt.unregister()
    }
}



const trigger = register("packetReceived", (packet) => {
    if (packet./*getActionNumber()*/func_148890_d() > 0) return
    if (worldLoadFlag) worldLoadFlag = false
    triggered()
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction).unregister()

const triggerAlt = register("packetReceived", () => {
    if (!worldLoadFlag) return triggerAlt.unregister()
    triggered(true)
}).setFilteredClass(net.minecraft.network.play.server.S03PacketTimeUpdate).unregister()



let firstLoad = World.isLoaded()
register("worldLoad", () => {
    if (firstLoad) return firstLoad = false
    worldLoadFlag = true
    if (tasks.length) triggerAlt.register()
}).register()



export default function scheduleTask(func, delay) {
    tasks.push([func, delay])
    trigger.register()
    if (worldLoadFlag) triggerAlt.register()
}