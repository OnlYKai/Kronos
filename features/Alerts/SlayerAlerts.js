import config from "../../config"
import showTitle from "../../utils/Title"

const bosses = new Set([
    "Any Slayer Boss",
    "Revenant Horror",
    "Tarantula Broodfather",
    "Sven Packmaster",
    "Voidgloom Seraph",
    "Riftstalker Bloodfiend",
    "Inferno Demonlord"
])

register("chat", (event) => {
    if (!config.bossSpawnedAlert) return
    const spawnedBoss = new TextComponent(event.message)?.getHoverValue()?.match(/§r§aWhen:\n§r§c([a-zA-Z ]+) §r§7spawns.\n/)?.[1]
    if (!spawnedBoss || !bosses.has(spawnedBoss)) return
    showTitle("§cBoss Spawned!", "", 1500)
    new Sound({ source: "attention.ogg", priority: true })?.play()
})
.setChatCriteria("Autopet equipped your ${*}! VIEW RULE")