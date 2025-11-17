import config from "./config"
import { Color } from "../Vigilance"
import hudManager from "./hudManager"

// ---------- General ----------
import "./features/General/BetterTablist"
import "./features/General/PearlRefill"
import "./features/General/CancelBlockInteracts"
import "./features/General/CorpseESP"
import "./features/General/SphinxAutoAnswer"
import "./features/General/SupercraftAmount"
import "./features/General/ItemCreationDate"
import "./features/General/ItemQualityAndFloor"
import "./features/General/NecromancySoulsFloor"
import "./features/General/PricePerItem"
import "./features/General/DyedLore"
import "./features/General/WarpTomb"
import "./features/General/WitherShieldTimer"
// ---------- HUD ----------
import "./features/HUD/FPS"
import "./features/HUD/TPS"
import "./features/HUD/InventoryHUD"
import "./features/HUD/Spotify"
import "./features/HUD/CakeTimer"
import "./features/HUD/SpringBootsHeight"
// ---------- Dungeons ----------
import "./features/Dungeons/AutoCloseChests"
import "./features/Dungeons/FuckDiorite"
import "./features/Dungeons/HideDinnerboneNametags"
import "./features/Dungeons/M3Timer"
import "./features/Dungeons/DungeonESP"
// ---------- Slayer ----------
import "./features/Slayer/Voidgloom"
// ---------- Alerts ----------
import "./features/Alerts/RareDropAlerts"
import "./features/Alerts/DungeonAlerts"
import "./features/Alerts/KuudraAlerts"
import "./features/Alerts/SlayerAlerts"
import "./features/Alerts/RagAxeAlert"
import "./features/Alerts/VanquisherAlert"
// ---------- Chat ----------
import "./features/Chat/ChatEmotes"
import "./features/Chat/SpamHider"

//import "./features/test"



/* TODO:
 * Test Phoenix Pet and Dye Alerts, still have debug messages
 * 
 * Metal Detector Solver   (no)
 * Stats (networth) next to name   (SkyCrypt api now private)
 * Make Max Supercraft Amount tooltip render based   (ListFix has no insert)
 * 
*/



// ------------------------------ MAIN COMMAND ------------------------------
register("command", (...args) => {
    if (!args) return config.openGUI()
    args = args.map(arg => arg.toLowerCase())
    if (args[0] === "help") return ChatLib.chat(getHelp())
    if (args[0] === "gui" && args[1] === "reset") return hudManager.resetHuds()
    if (args[0] === "gui") return hudManager.openGUI()
    if (args[0] === "reset") return resetConfig()
    config.openGUI()
}).setName("kronos").setAliases(["k", "kr", "kron", "kys"])

const getHelp = () =>
`§b§m${ChatLib.getChatBreak(" ")}
§bAliases:
  /kronos /kron /kr /k
§bCommands:
  /kronos             (opens settings)
  /kronos gui         (gui editor)
  /kronos gui reset   (resets gui)
  /kronos reset       (resets settings)
§b§m${ChatLib.getChatBreak(" ")}`

function resetConfig() {
    // ------------------------------ General ------------------------------
    // ---------- Better Tablist ----------
    config.betterTablist = false
    config.betterTablistHeader = "&z&lSKYBLOCK"
    // ---------- Random Stuff ----------
    config.pearlRefill = false
    config.cancelInteract = 0
    config.corpseEsp = false
    config.sphinxAutoAnswer = false
    config.supercraftAmount = false
    config.itemCreationDate = false
    config.itemQualityAndFloor = false
    config.necromancySoulsFloor = false
    config.pricePerItem = false
    config.dyedLore = 0
    config.warpTomb = 0
    config.witherShieldTimer = 0

    // ------------------------------ HUD ------------------------------
    // ---------- FPS ----------
    config.fps = false
    config.fpsMode = 0
    config.fpsPrefix = "&dFPS: &r"
    // ---------- TPS ----------
    config.tps = false
    config.tpsPrefix = "&3TPS: &r"
    // ---------- Inventory HUD ----------
    config.inventoryHud = false
    config.inventoryHudChroma = true
    config.inventoryHudBgColorJava = new Color(0, 0, 0, 0.5) // 0x90000000 144/255
    config.inventoryHudBgColor = Renderer.color(config.inventoryHudBgColorJava.getRed(), config.inventoryHudBgColorJava.getGreen(), config.inventoryHudBgColorJava.getBlue(), config.inventoryHudBgColorJava.getAlpha())
    config.inventoryHudAccentColorJava = new Color(1, 0, 1, 1)
    config.inventoryHudAccentColor = Renderer.color(config.inventoryHudAccentColorJava.getRed(), config.inventoryHudAccentColorJava.getGreen(), config.inventoryHudAccentColorJava.getBlue(), config.inventoryHudAccentColorJava.getAlpha())
    config.inventoryHudSectionBgColor = Renderer.color(config.inventoryHudAccentColorJava.getRed(), config.inventoryHudAccentColorJava.getGreen(), config.inventoryHudAccentColorJava.getBlue(), Math.min(15, config.inventoryHudAccentColorJava.getAlpha()))
    config.inventoryHudShowSectionBg = true
    config.inventoryHudShowPlayer = true
    // ---------- Misc HUDs ----------
    config.spotify = false
    config.cakeTimer = false
    config.springBootsHeight = false

    // ------------------------------ Dungeons ------------------------------
    config.autoCloseChests = false
    config.hideBuggedStarMobNametags = false
    config.hideDinnerboneNametags = false
    config.M3Timer = false
    config.fuckDiorite = 0
    // ---------- Star Mob ESP ----------
    config.starMobEsp = 0
    config.starMobEspChroma = false
    config.starMobEspColorJava = new Color(1, 0, 1, 1) // new Color(183/255, 8/255, 107/255, 1) // #B7086B
    config.starMobEspColor = [config.starMobEspColorJava.getRed()/255, config.starMobEspColorJava.getGreen()/255, config.starMobEspColorJava.getBlue()/255, config.starMobEspColorJava.getAlpha()/255]
    config.starMobEspPhase = false
    // ---------- Shadow Assassin ESP ----------
    config.shadowAssassinEsp = 0
    config.shadowAssassinEspChroma = false
    config.shadowAssassinEspColorJava = new Color(1,0,0,1)
    config.shadowAssassinEspColor = [config.shadowAssassinEspColorJava.getRed()/255, config.shadowAssassinEspColorJava.getGreen()/255, config.shadowAssassinEspColorJava.getBlue()/255, config.shadowAssassinEspColorJava.getAlpha()/255]
    config.shadowAssassinEspPhase = false
    // ---------- Wither/Blood Key ESP ----------
    config.witherKeyEsp = 0
    config.witherKeyEspDrawLine = true
    config.witherKeyEspChroma = false
    config.witherKeyEspColorJava = new Color(0,1,0,1)
    config.witherKeyEspColor = [config.witherKeyEspColorJava.getRed()/255, config.witherKeyEspColorJava.getGreen()/255, config.witherKeyEspColorJava.getBlue()/255, config.witherKeyEspColorJava.getAlpha()/255]
    config.witherKeyEspPhase = false

    // ------------------------------ Slayer ------------------------------
    // ---------- Voidgloom ----------
    config.voidgloomLaserTimer = false

    // ------------------------------ Alerts ------------------------------
    // ---------- Rare Drop Alerts ----------
    config.phoenixAlert = false
    config.iceSprayAlert = false
    config.dyeAlert = false
    config.rareSlayerDropAlert = false
    // ---------- Dungeon Alerts ----------
    config.witherKeyAlert = false
    config.bloodSpawnedAlert = false
    config.bloodClearedAlert = false
    // ---------- Kuudra Alerts ----------
    config.noKeyAlert = false
    config.stunnedAlert = false
    config.dropshipAlert = false
    // ---------- Slayer Alerts ----------
    config.bossSpawnedAlert = false
    // ---------- Misc Alerts ----------
    config.ragAxeAlert = false
    config.vanquisherAlert = false

    // ------------------------------ Chat ------------------------------
    // ---------- Chat Emotes ----------
    config.chatEmotes = false
    config.chatEmotesMvp = true
    config.chatEmotesGift = true
    config.chatEmotesCustom = true
    // ---------- Spam Hider ----------
    config.hideTippingMessages = false

    ChatLib.chat("§bKronos §7» §rSettings reset!")
}