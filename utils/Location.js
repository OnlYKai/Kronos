import { in3DBounds } from "./Math"

const listeners = []
const listenersArea = []
const listenersZone = []
const listenersMisc = []



let firstLoad = World.isLoaded()
register("worldLoad", () => {
    if (firstLoad) return firstLoad = false

    for (let key in location) {
        let type = typeof location[key]
        if (type === "boolean") location[key] = false
        else if (type === "string") location[key] = ""
    }
    dispatchEvent(0)

    dungeonBossReg.unregister()
    tablistReg.register()
    scoreboardReg.register()
})



const tablistReg = register("packetReceived", (packet) => {
    if (packet./*getAction()*/func_179768_b() !== net.minecraft.network.play.server.S38PacketPlayerListItem$Action.ADD_PLAYER) return
    const data = packet./*getEntries()*/func_179767_a()
    let name = data.length ? data[0]./*getDisplayName()*/func_179961_d()?./*getUnformattedText()*/func_150260_c() ?? "" : ""
    if (!/^Area: |^Dungeon: /.test(name)) return
    name = name.replace(/^Area: |^Dungeon: |[^\u0000-\u007F]/g, "").trim()
    if(!name) return

    location.area = name
    location[name.replace(/[^a-zA-Z0-9]/g, "")] = true
    dispatchEvent(1)

    if (location.Catacombs) dungeonBossReg.register()
    tablistReg.unregister()
}).unregister()
.setFilteredClass(net.minecraft.network.play.server.S38PacketPlayerListItem)



const scoreboardReg = register("packetReceived", (packet) => {
    if (packet./*getAction()*/func_149307_h() !== 2) return
    let line = (packet./*getPrefix()*/func_149311_e() + packet./*getSuffix()*/func_149309_f())
    if (!/^ §7⏣ |^ §5ф /.test(line)) return
    line = line.removeFormatting().replace(/[^\u0000-\u007F]/g, "").trim()
    if (!line || line === "None") return

    location.zone = line
    dispatchEvent(2)

    location.DungeonFloor = location.zone.match(/^The Catacombs \((E|F[1-7]|M[1-7])\)$/)?.[1] ?? ""
    location.KuudraTier = location.zone.match(/^Kuudra's Hollow \((T[1-5])\)$/)?.[1] ?? ""
    if (location.DungeonFloor || location.KuudraTier) {
        dispatchEvent(3)
        scoreboardReg.unregister()
    }
}).unregister()
.setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)



const dungeonBossEntryMessages = new Set([ // Messages from: https://github.com/DocilElm/Doc/blob/d0847933e4be40060101d0a8abc43f6ba31cb638/shared/Persistence.js#L26
    "[BOSS] Bonzo: Gratz for making it this far, but I'm basically unbeatable.",
    "[BOSS] Scarf: This is where the journey ends for you, Adventurers.",
    "[BOSS] The Professor: I was burdened with terrible news recently...",
    "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!",
    "[BOSS] Livid: Welcome, you've arrived right on time. I am Livid, the Master of Shadows.",
    "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!",
    "[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!"
])
const dungeonBossReg = register("chat", (event) => {
    if (!dungeonBossEntryMessages.has(ChatLib.getChatMessage(event, false))) return
    location.inDungeonBoss = true
    dispatchEvent(3)
    dungeonBossReg.unregister()
}).unregister()
.setChatCriteria("[BOSS] ${*}")





function dispatchEvent(event) {
    if (event === 0) return listeners.forEach(func => func())
    if (event === 1) return listenersArea.forEach(func => func())
    if (event === 2) return listenersZone.forEach(func => func())
    if (event === 3) return listenersMisc.forEach(func => func())
}

/** @param {string|string[]} target "Area", "Zone", "Misc" */
function addListener(target, func) {
    if (typeof target !== "string" && !Array.isArray(target)) throw new TypeError(`Location listener target must be a string or array!`)
    if (typeof func !== "function") throw new TypeError(`Location listener func must be a function!`)
    if (typeof target === "string") target = [target]
    listeners.push(func)
    target.forEach(t => {
        if (t === "Area") return listenersArea.push(func)
        if (t === "Zone") return listenersZone.push(func)
        if (t === "Misc") return listenersMisc.push(func)
        throw new Error(`"${t}" is not a valid location listener target`)
    })
}





const location = {
    area: "",
    zone: "",

    PrivateIsland: false,
    Garden: false,
    JerrysWorkshop: false,
    DarkAuction: false,
    Hub: false,
    DungeonHub: false,
    Catacombs: false,
    FarmingIslands: false,
    ThePark: false,
    SpidersDen: false,
    TheEnd: false,
    CrimsonIsle: false,
    Kuudra: false,
    GoldMine: false,
    DeepCaverns: false,
    DwarvenMines: false,
    Mineshaft: false,
    CrystalHollows: false,
    TheRift: false,
    BackwaterBayou: false,

    inDungeonBoss: false,
    DungeonFloor: "",
    KuudraTier: "",

    addListener: addListener
}

export default location





const bossRoomCorners = Object.freeze({
    M7: [[-8, 0, -8], [134, 254, 147]],
    M6: [[-40, 51, -8], [22, 110, 134]],
    M5: [[-40, 112, -8], [50, 53, 118]],
    M4: [[-40, 112, -40], [50, 53, 47]],
    M3: [[-40, 118, -40], [42, 64, 31]],
    M2: [[-40, 99, -40], [24, 54, 59]],
    M1: [[-14, 55, 49], [-72, 146, -40]],
// Coords from: https://github.com/Noamm9/NoammAddons/blob/master/src/main/kotlin/noammaddons/utils/LocationUtils.kt#L185
    F7: [[-8, 0, -8], [134, 254, 147]],
    F6: [[-40, 51, -8], [22, 110, 134]],
    F5: [[-40, 112, -8], [50, 53, 118]],
    F4: [[-40, 112, -40], [50, 53, 47]],
    F3: [[-40, 118, -40], [42, 64, 31]],
    F2: [[-40, 99, -40], [24, 54, 59]],
    F1: [[-14, 55, 49], [-72, 146, -40]]
})

if (World.isLoaded()) {
    const area = TabList?.getNames()?.find(name => /^§r§b§lArea: |^§r§b§lDungeon: /.test(name))?.removeFormatting()?.replace(/^Area: |^Dungeon: |[^\u0000-\u007F]/g, "")?.trim()
    if (area) {
        location.area = area
        location[area.replace(/[^a-zA-Z0-9]/g, "")] = true
    }

    const zone = Scoreboard?.getLines()?.find(line => /^ §7⏣ |^ §5ф /.test(line))?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")?.trim()
    if (zone && zone !== "None") {
        location.zone = zone
        location.DungeonFloor = location.zone.match(/^The Catacombs \((E|F[1-7]|M[1-7])\)$/)?.[1] ?? ""
        location.KuudraTier = location.zone.match(/^Kuudra's Hollow \((T[1-5])\)$/)?.[1] ?? ""
        if (bossRoomCorners[location.DungeonFloor] && in3DBounds([Player.getX(), Player.getY(), Player.getZ()], bossRoomCorners[location.DungeonFloor][0], bossRoomCorners[location.DungeonFloor][1])) location.inDungeonBoss = true
    }

    dispatchEvent(0)

    if (!location.area) tablistReg.register()
    if (!location.DungeonFloor && !location.KuudraTier) scoreboardReg.register()
    if (location.Catacombs && !location.inDungeonBoss) dungeonBossReg.register()
}