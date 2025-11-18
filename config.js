import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @ColorProperty, Color, @CheckboxProperty, @TextProperty, @SliderProperty } from "../Vigilance"
import request from "../requestV2"
import downloadFile from "./utils/Downloader"

const FileUtils = Java.type("org.apache.commons.io.FileUtils")
const File = Java.type("java.io.File")

const configLines = FileLib.read("Kronos", "config.js").split("\n")
const categories = configLines.filter(line => line.trim().startsWith("category:")).map(line => line.trim().replace(/^category: *("|'|`)|("|'|`),?$/g, ""))
@Vigilant("../../Kronos", "§zKronos §7(Move HUDs with /kronos gui)", {
    getCategoryComparator: () => (a, b) => {
        return categories.indexOf(a.name) - categories.indexOf(b.name)
    }
})

class Config {
    constructor() {
        this.initialize(this)

        // ------------------------------ DEPENDENCIES ------------------------------
        // ---------- Chat Emotes ----------
        this.addDependency("MVP++ Emotes", "Chat Emotes")
        this.addDependency("Rank Gift Emotes", "Chat Emotes")
        this.addDependency("Custom Emotes", "Chat Emotes")

        // ---------- Better Tablist ----------
        this.addDependency("Custom Header", "Better Tablist")

        // ---------- FPS/TPS ----------
        this.addDependency("FPS Mode", "FPS")
        this.addDependency("FPS Prefix", "FPS")
        this.addDependency("TPS Prefix", "TPS")
        // ---------- Inventory HUD ----------
        this.addDependency("🌒Chroma", "Inventory HUD")
        this.addDependency("🌒Background Color", "Inventory HUD")
        this.addDependency("🌒Accent Color", "Inventory HUD")
        this.addDependency("🌒Show Section Backgrounds", "Inventory HUD")
        this.addDependency("🌒Show Player", "Inventory HUD")



        // ------------------------------ COLORS ------------------------------
        // ---------- Dungeon ESP ----------
        this.starMobEspColor = [this.starMobEspColorJava.getRed()/255, this.starMobEspColorJava.getGreen()/255, this.starMobEspColorJava.getBlue()/255, this.starMobEspColorJava.getAlpha()/255]
        this.shadowAssassinEspColor = [this.shadowAssassinEspColorJava.getRed()/255, this.shadowAssassinEspColorJava.getGreen()/255, this.shadowAssassinEspColorJava.getBlue()/255, this.shadowAssassinEspColorJava.getAlpha()/255]
        this.witherKeyEspColor = [this.witherKeyEspColorJava.getRed()/255, this.witherKeyEspColorJava.getGreen()/255, this.witherKeyEspColorJava.getBlue()/255, this.witherKeyEspColorJava.getAlpha()/255]
        this.registerListener("Color (✯)", color => this.starMobEspColor = [color.getRed()/255, color.getGreen()/255, color.getBlue()/255, color.getAlpha()/255])
        this.registerListener("Color (SA)", color => this.shadowAssassinEspColor = [color.getRed()/255, color.getGreen()/255, color.getBlue()/255, color.getAlpha()/255])
        this.registerListener("Color (Keys)", color => this.witherKeyEspColor = [color.getRed()/255, color.getGreen()/255, color.getBlue()/255, color.getAlpha()/255])

        // ---------- Inventory HUD ----------
        this.inventoryHudBgColor = Renderer.color(this.inventoryHudBgColorJava.getRed(), this.inventoryHudBgColorJava.getGreen(), this.inventoryHudBgColorJava.getBlue(), this.inventoryHudBgColorJava.getAlpha())
        this.inventoryHudAccentColor = Renderer.color(this.inventoryHudAccentColorJava.getRed(), this.inventoryHudAccentColorJava.getGreen(), this.inventoryHudAccentColorJava.getBlue(), this.inventoryHudAccentColorJava.getAlpha())
        this.inventoryHudSectionBgColor = Renderer.color(this.inventoryHudAccentColorJava.getRed(), this.inventoryHudAccentColorJava.getGreen(), this.inventoryHudAccentColorJava.getBlue(), Math.min(15, this.inventoryHudAccentColorJava.getAlpha()))
        this.registerListener("🌒Background Color", color => this.inventoryHudBgColor = Renderer.color(color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha()))
        this.registerListener("🌒Accent Color", color => {
            this.inventoryHudAccentColor = Renderer.color(color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha())
            this.inventoryHudSectionBgColor = Renderer.color(color.getRed(), color.getGreen(), color.getBlue(), Math.min(15, color.getAlpha()))
        })
    }

    // ------------------------------ General ------------------------------
    // ---------- Update ----------
    @ButtonProperty({
        name: "Check for Updates",
        description: "Opens your browser if you are not on the latest version",
        category: "General",
        subcategory: "Update",
        placeholder: "Check"
    })
    updateAction() {
        request({
            url: "https://api.github.com/repos/OnlYKai/Kronos/releases/latest",
            json: true
        }).then((response) => {
            const current_ver = JSON.parse(FileLib.read("Kronos", "./metadata.json")).version
            const latest_ver = response.tag_name
            if (current_ver !== latest_ver) {
                console.log("Remove old files...")
                try { FileUtils.cleanDirectory(new File("./config/ChatTriggers/modules/Kronos")) }
                catch (e) { console.log("err") }
                console.log("Removed!")
                console.log("Downloading...")
                downloadFile("https://github.com/OnlYKai/Kronos/releases/latest/download/Kronos.zip", "./config/ChatTriggers/modules/Kronos/Kronos.zip")
                console.log("Downloaded!")
                console.log("Unzipping...")
                FileLib.unzip("./config/ChatTriggers/modules/Kronos/Kronos.zip", "./config/ChatTriggers/modules/Kronos")
                console.log("Unzipped!")
                console.log("Cleanup...")
                FileLib.delete("Kronos", "Kronos.zip")
                console.log("Cleaned!")
                Client.scheduleTask(() => {
                    if (Client.currentGui.get().class.getName() === "gg.essential.vigilance.gui.SettingsGui") Client.currentGui.close()
                })
                ChatTriggers.loadCT()
            }
        })
    }

    // ---------- Better Tablist ----------
    @SwitchProperty({
        name: "Better Tablist",
        category: "General",
        subcategory: "🌀Better Tablist"
    })
    betterTablist = false

    @TextProperty({
        name: "Custom Header",
        description: "Leave empty for no header",
        category: "General",
        subcategory: "🌀Better Tablist",
        placeholder: "&z&lSKYBLOCK"
    })
    betterTablistHeader = "&z&lSKYBLOCK"

    // ---------- Random Stuff ----------
    @SwitchProperty({
        name: "§4Auto Pearl Refill",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    pearlRefill = false

    @SelectorProperty({
        name: "§4Cancel Interact",
        description: "§cDisabled on private island!",
        category: "General",
        subcategory: "🌏Random Stuff",
        options: ["Off", "Pearls", "Abilities", "Both"]
    })
    cancelInteract = 0;

    @SwitchProperty({
        name: "§4Corpse ESP",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    corpseEsp = false

    @SwitchProperty({
        name: "§4Sphinx Auto Answer",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    sphinxAutoAnswer = false

    @SwitchProperty({
        name: "Max Supercraft Amount",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    supercraftAmount = false

    @SwitchProperty({
        name: "Show Item Creation Date",
        description: "§aRequires:§r Holding Shift",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    itemCreationDate = false

    @SwitchProperty({
        name: "Show Item Quality and Floor",
        description: "§cReplaces Gear Score",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    itemQualityAndFloor = false

    @SwitchProperty({
        name: "Show Necromancy Souls' Dungeon Floor",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    necromancySoulsFloor = false

    @SwitchProperty({
        name: "Show Price Per Item",
        description: "Shows price per item when buying stacks in the auction house",
        category: "General",
        subcategory: "🌏Random Stuff"
    })
    pricePerItem = false

    @SelectorProperty({
        name: "Remove/Replace 'Dyed' in Lore",
        description: "Replaced with 'Color: #XXXXXX'",
        category: "General",
        subcategory: "🌏Random Stuff",
        options: ["Off", "Remove", "Replace", "On Shift"]
    })
    dyedLore = 0;

    @SelectorProperty({
        name: "/Warp Tomb",
        description: "/warp tomb as an alias for /warp smold (Short means /tomb)",
        category: "General",
        subcategory: "🌏Random Stuff",
        options: ["Off", "On", "On + Short"]
    })
    warpTomb = 0;

    @SelectorProperty({
        name: "Wither Shield Timer",
        description: "Shows 5s Wither Shield timer above/below crosshair",
        category: "General",
        subcategory: "🌏Random Stuff",
        options: ["Off", "Above", "Below"]
    })
    witherShieldTimer = 0;

    // ------------------------------ HUD ------------------------------
    // ---------- FPS ----------
    @SwitchProperty({
        name: "FPS",
        category: "HUD",
        subcategory: "🌐FPS"
    })
    fps = false

    @SelectorProperty({
        name: "FPS Mode",
        category: "HUD",
        subcategory: "🌐FPS",
        options: ["Normal", "Fast"]
    })
    fpsMode = 0;

    @TextProperty({
        name: "FPS Prefix",
        description: "Leave empty for no prefix. Put '&⭍r' at the end for dynamic coloring",
        category: "HUD",
        subcategory: "🌐FPS",
        placeholder: "&dFPS: &r"
    })
    fpsPrefix = "&dFPS: &r"

    // ---------- TPS ----------
    @SwitchProperty({
        name: "TPS",
        category: "HUD",
        subcategory: "🌑TPS"
    })
    tps = false

    @TextProperty({
        name: "TPS Prefix",
        description: "Leave empty for no prefix. Put '&⭍r' at the end for dynamic coloring",
        category: "HUD",
        subcategory: "🌑TPS",
        placeholder: "&3TPS: &r"
    })
    tpsPrefix = "&3TPS: &r"

    // ---------- Inventory HUD ----------
    @SwitchProperty({
        name: "Inventory HUD",
        category: "HUD",
        subcategory: "🌒Inventory HUD"
    })
    inventoryHud = false

    @SwitchProperty({
        name: "🌒Chroma",
        category: "HUD",
        subcategory: "🌒Inventory HUD"
    })
    inventoryHudChroma = true

    @ColorProperty({
        name: "🌒Background Color",
        category: "HUD",
        subcategory: "🌒Inventory HUD"
    })
    inventoryHudBgColorJava = new Color(0, 0, 0, 0.5) // 0x90000000 144/255

    @ColorProperty({
        name: "🌒Accent Color",
        category: "HUD",
        subcategory: "🌒Inventory HUD"
    })
    inventoryHudAccentColorJava = new Color(1, 0, 1, 1)

    @SwitchProperty({
        name: "🌒Show Section Backgrounds",
        description: "Shows a background in accent color for item sections",
        category: "HUD",
        subcategory: "🌒Inventory HUD"
    })
    inventoryHudShowSectionBg = true

    @SwitchProperty({
        name: "🌒Show Player",
        category: "HUD",
        subcategory: "🌒Inventory HUD"
    })
    inventoryHudShowPlayer = true

    // ---------- Misc HUDs ----------
    @SwitchProperty({
        name: "Spotify Playing",
        category: "HUD",
        subcategory: "🌟Misc HUDs"
    })
    spotify = false

    @SwitchProperty({
        name: "Cake Timer",
        category: "HUD",
        subcategory: "🌟Misc HUDs"
    })
    cakeTimer = false

    @SwitchProperty({
        name: "Spring Boots Height Display",
        description: "Turns green in F7/M7 when crystal height is reached",
        category: "HUD",
        subcategory: "🌟Misc HUDs"
    })
    springBootsHeight = false

    // ------------------------------ Dungeons ------------------------------
    @SwitchProperty({
        name: "§4Auto Close Chests",
        category: "Dungeons",
        subcategory: "🌰Dungeons"
    })
    autoCloseChests = false

    @SwitchProperty({
        name: "Hide Bugged Star Mob Nametags",
        description: "Hides bugged star mob nametags that still have health",
        category: "Dungeons",
        subcategory: "🌰Dungeons"
    })
    hideBuggedStarMobNametags = false

    @SwitchProperty({
        name: "Hide Dinnerbone Nametags",
        category: "Dungeons",
        subcategory: "🌰Dungeons"
    })
    hideDinnerboneNametags = false

    @SwitchProperty({
        name: "M3 Fire Freeze Timer",
        description: "Move with /kronos gui",
        category: "Dungeons",
        subcategory: "🌰Dungeons"
    })
    M3Timer = false

    @SelectorProperty({
        name: "§4Fuck Diorite",
        category: "Dungeons",
        subcategory: "🌰Dungeons",
        options: ["Off", "On", "Schitzo"]
    })
    fuckDiorite = 0;

    // ---------- Star Mob ESP ----------
    @SelectorProperty({
        name: "Star Mob ESP",
        category: "Dungeons",
        subcategory: "🌽Star Mob ESP",
        options: ["Off", "Box Outline", "Box Filled"]
    })
    starMobEsp = 0;

    @SwitchProperty({
        name: "Chroma (✯)",
        category: "Dungeons",
        subcategory: "🌽Star Mob ESP"
    })
    starMobEspChroma = false

    @ColorProperty({
        name: "Color (✯)",
        category: "Dungeons",
        subcategory: "🌽Star Mob ESP"
    })
    starMobEspColorJava = new Color(1, 0, 1, 1) // new Color(183/255, 8/255, 107/255, 1) // #B7086B

    @SwitchProperty({
        name: "§4Disable Depth Check (✯)",
        description: "Makes outlines visible through walls (ESP)",
        category: "Dungeons",
        subcategory: "🌽Star Mob ESP"
    })
    starMobEspPhase = false

    // ---------- Shadow Assassin ESP ----------
    @SelectorProperty({
        name: "Shadow Assassin ESP",
        category: "Dungeons",
        subcategory: "🌾Shadow Assassin ESP",
        options: ["Off", "Box Outline", "Box Filled"]
    })
    shadowAssassinEsp = 0;

    @SwitchProperty({
        name: "Chroma (SA)",
        category: "Dungeons",
        subcategory: "🌾Shadow Assassin ESP",
    })
    shadowAssassinEspChroma = false

    @ColorProperty({
        name: "Color (SA)",
        category: "Dungeons",
        subcategory: "🌾Shadow Assassin ESP"
    })
    shadowAssassinEspColorJava = new Color(1,0,0,1)

    @SwitchProperty({
        name: "§4Disable Depth Check (SA)",
        description: "Makes outlines visible through walls (ESP)",
        category: "Dungeons",
        subcategory: "🌾Shadow Assassin ESP"
    })
    shadowAssassinEspPhase = false

    // ---------- Wither/Blood Key ESP ----------
    @SelectorProperty({
        name: "Wither/Blood Key ESP",
        category: "Dungeons",
        subcategory: "🌿Wither/Blood Key ESP",
        options: ["Off", "Box Outline", "Box Filled"]
    })
    witherKeyEsp = 0;

    @CheckboxProperty({
        name: "Draw Line (Keys)",
        category: "Dungeons",
        subcategory: "🌿Wither/Blood Key ESP"
    })
    witherKeyEspDrawLine = true

    @SwitchProperty({
        name: "Chroma (Keys)",
        category: "Dungeons",
        subcategory: "🌿Wither/Blood Key ESP"
    })
    witherKeyEspChroma = false

    @ColorProperty({
        name: "Color (Keys)",
        category: "Dungeons",
        subcategory: "🌿Wither/Blood Key ESP"
    })
    witherKeyEspColorJava = new Color(0,1,0,1)

    @SwitchProperty({
        name: "§4Disable Depth Check (Keys)",
        description: "Makes outlines visible through walls (ESP)",
        category: "Dungeons",
        subcategory: "🌿Wither/Blood Key ESP"
    })
    witherKeyEspPhase = false

    // ------------------------------ Slayer ------------------------------
    // ---------- Zombie ----------
    // ---------- Tarantula ----------
    // ---------- Sven ----------
    // ---------- Voidgloom ----------
    @SwitchProperty({
        name: "Laser Timer",
        category: "Slayer",
        subcategory: "🍃Voidgloom"
    })
    voidgloomLaserTimer = false

    // ---------- Vampire ----------
    // ---------- Blaze ----------

    // ------------------------------ Alerts ------------------------------
    // ---------- Rare Drop Alerts ----------
    @SwitchProperty({
        name: "Phoenix Alert",
        category: "Alerts",
        subcategory: "🍐Rare Drop Alerts"
    })
    phoenixAlert = false

    @SwitchProperty({
        name: "Ice Spray Alert",
        category: "Alerts",
        subcategory: "🍐Rare Drop Alerts"
    })
    iceSprayAlert = false

    @SwitchProperty({
        name: "Dye Alert",
        category: "Alerts",
        subcategory: "🍐Rare Drop Alerts"
    })
    dyeAlert = false

    @SwitchProperty({
        name: "CRAZY RARE & INSANE DROP Alert",
        category: "Alerts",
        subcategory: "🍐Rare Drop Alerts"
    })
    rareSlayerDropAlert = false

    // ---------- Dungeon Alerts ----------
    @SwitchProperty({
        name: "Wither Key Alert",
        category: "Alerts",
        subcategory: "🍑Dungeon Alerts"
    })
    witherKeyAlert = false

    @SwitchProperty({
        name: "Blood Spawned Alert",
        category: "Alerts",
        subcategory: "🍑Dungeon Alerts"
    })
    bloodSpawnedAlert = false

    @SwitchProperty({
        name: "Blood Cleared Alert",
        category: "Alerts",
        subcategory: "🍑Dungeon Alerts"
    })
    bloodClearedAlert = false

    // ---------- Kuudra Alerts ----------
    @SwitchProperty({
        name: "No Key Alert",
        category: "Alerts",
        subcategory: "🍒Kuudra Alerts"
    })
    noKeyAlert = false

    @SwitchProperty({
        name: "Stunned Alert",
        category: "Alerts",
        subcategory: "🍒Kuudra Alerts"
    })
    stunnedAlert = false

    @SwitchProperty({
        name: "Dropship Alert",
        category: "Alerts",
        subcategory: "🍒Kuudra Alerts"
    })
    dropshipAlert = false

    // ---------- Slayer Alerts ----------
    @SwitchProperty({
        name: "Boss Spawned Alert",
        description: "§aRequires:§r An autopet rule for when the slayer boss spawns!",
        category: "Alerts",
        subcategory: "🍓Slayer Alerts"
    })
    bossSpawnedAlert = false

    // ---------- Misc Alerts ----------
    @SwitchProperty({
        name: "RagAxe Alert",
        category: "Alerts",
        subcategory: "🍟Misc Alerts"
    })
    ragAxeAlert = false

    @SwitchProperty({
        name: "Vanquisher Alert",
        category: "Alerts",
        subcategory: "🍟Misc Alerts"
    })
    vanquisherAlert = false

    // ------------------------------ Chat ------------------------------
    // ---------- Chat Emotes ----------
    @SwitchProperty({
        name: "Chat Emotes",
        description: "MVP++ and Rank Gift emotes for everyone! ༼つ◕_◕༽つ",
        category: "Chat",
        subcategory: "🍠Chat Emotes"
    })
    chatEmotes = false

    @CheckboxProperty({
        name: "MVP++ Emotes",
        category: "Chat",
        subcategory: "🍠Chat Emotes"
    })
    chatEmotesMvp = true

    @CheckboxProperty({
        name: "Rank Gift Emotes",
        category: "Chat",
        subcategory: "🍠Chat Emotes"
    })
    chatEmotesGift = true

    @CheckboxProperty({
        name: "Custom Emotes",
        description: "/addemote and /rememote",
        category: "Chat",
        subcategory: "🍠Chat Emotes"
    })
    chatEmotesCustom = true
    
    // ---------- Spam Hider ----------
    @SwitchProperty({
        name: "Hide Tipping Messages",
        category: "Chat",
        subcategory: "🍡Spam Hider"
    })
    hideTippingMessages = false
}

export default new Config()