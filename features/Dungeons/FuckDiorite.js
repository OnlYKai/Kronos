import config from "../../config"
import location from "../../utils/Location"


// Credit: https://github.com/odtheking/Odin/blob/main/odinclient/src/main/kotlin/me/odinclient/features/impl/floor7/FuckDiorite.kt


const allGlassStates = []
for (let i = 0; i < 16; i++) allGlassStates.push(net.minecraft.init.Blocks./*stained_glass*/field_150399_cn./*getStateFromMeta()*/func_176203_a(i))

const glassStates = {
    red: allGlassStates[14],
    purple: allGlassStates[10],
    lime: allGlassStates[5],
    yellow: allGlassStates[4],
}

const centers = {
    red: [100, 168, 41],
    purple: [100, 168, 65],
    lime: [46, 168, 41],
    yellow: [46, 168, 65]
}





const centersPos = []

const pillars = {
    red: [],
    purple: [],
    lime: [],
    yellow: [],
}

for (let key in centers) {
    let [cX, cY, cZ] = centers[key]
    centersPos.push(new net.minecraft.util.BlockPos(cX, 205, cZ))
    for (let x = cX - 3; x <= cX + 3; x++) {
        for (let y = cY; y <= cY + 37; y++) {
            for (let z = cZ - 3; z <= cZ + 3; z++) {
                pillars[key].push(new net.minecraft.util.BlockPos(x, y, z))
            }
        }
    }
}





const tick = register("tick", () => {
    ChatLib.chat("world")
    const world = World.getWorld()

    if (!centersPos.every(pos => {
        const blockState = world./*getBlockState()*/func_180495_p(pos)
        return isDiorite(blockState) || blockState./*getBlock()*/func_177230_c().registryName === "minecraft:stained_glass"
    })) return

    for (let key in pillars) {
        let pillar = pillars[key]
        for (let i = 0; i < pillar.length; i++) {
            let pos = pillar[i]
            let blockState = world./*getBlockState()*/func_180495_p(pos)
            if (!isDiorite(blockState) && blockState./*getBlock()*/func_177230_c().registryName !== "minecraft:stained_glass") continue

            if (config.fuckDiorite === 1) world./*setBlockState()*/func_175656_a(pos, glassStates[key])
            else if (config.fuckDiorite === 2) world./*setBlockState()*/func_175656_a(pos, allGlassStates[Math.random()*16|0])
        }
    }

    tick.unregister()
}).unregister()



const packetBlockChange = register("packetReceived", (packet) => {
    const blockState = packet./*blockState*/field_148883_d
    if (!isDiorite(blockState)) return

    const color = getPillarColor(packet./*getBlockPosition()*/func_179827_b())
    if (!color) return

    if (config.fuckDiorite === 1) packet./*blockState*/field_148883_d = glassStates[color]
    else if (config.fuckDiorite === 2) packet./*blockState*/field_148883_d = allGlassStates[Math.random()*16|0]
}).unregister()
.setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange)



const packetMultiBlockChange = register("packetReceived", (packet, event) => {
    const changes = []
    if (!packet./*getChangedBlocks()*/func_179844_a().every(changed => {
        const blockState = changed./*getBlockState()*/func_180088_c()
        if (isDiorite(blockState)) {
            const blockPos = changed./*getPos()*/func_180090_a()
            changes.push(blockPos)
            return true
        }
        const registryName = blockState./*getBlock()*/func_177230_c().registryName
        if (registryName === "minecraft:piston_extension" || registryName === "minecraft:stained_hardened_clay") return true
    })) return
    if (!changes.length) return

    const color = getPillarColor(changes[0])
    if (!color) return

    cancel(event)
    const world = World.getWorld()
    if (config.fuckDiorite === 1) for (let i = 0; i < changes.length; i++) world./*setBlockState()*/func_175656_a(changes[i], glassStates[color])
    else if (config.fuckDiorite === 2) for (let i = 0; i < changes.length; i++) world./*setBlockState()*/func_175656_a(changes[i], allGlassStates[Math.random()*16|0])
}).unregister()
.setFilteredClass(net.minecraft.network.play.server.S22PacketMultiBlockChange)





function isDiorite(blockState) {
    const block = blockState./*getBlock()*/func_177230_c()
    const registryName = block.registryName
    const blockMeta = block./*getMetaFromState()*/func_176201_c(blockState)
    return registryName === "minecraft:stone" && (blockMeta === 3 || blockMeta === 4)
}

function getPillarColor(blockPos) {
    const [bX, bZ] = [blockPos./*getX()*/func_177958_n(), blockPos./*getZ()*/func_177952_p()]
    for (let key in centers) {
        let [cX, _, cZ] = centers[key]
        if (Math.abs(bX - cX) <= 3 && Math.abs(bZ - cZ) <= 3) return key
    }
}





const registerAll = () => [tick, packetBlockChange, packetMultiBlockChange].forEach(r => r.register())
const unregisterAll = () => [tick, packetBlockChange, packetMultiBlockChange].forEach(r => r.unregister())

config.registerListener("§4Fuck Diorite", state => state && location.inDungeonBoss && location.DungeonFloor.endsWith("7") ? registerAll() : unregisterAll())
location.addListener("Misc", () => config.fuckDiorite && location.inDungeonBoss && location.DungeonFloor.endsWith("7") ? registerAll() : unregisterAll())
if (config.fuckDiorite && location.inDungeonBoss && location.DungeonFloor.endsWith("7")) registerAll()