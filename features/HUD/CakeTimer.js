import reg from "../../utils/Register"
import config from "../../config"
import PogObject from "../../../PogData"
import hudManager from "../../hudManager"

const StatSymbols = Object.freeze({
    "Strength": "❁",
    "Ferocity": "⫽",
    "Speed": "✦",
    "Defense": "❈",
    "Vitality": "♨",
    "Mining Fortune": "☘",
    "Cold Resistance": "❄",
    "Intelligence": "✎",
    "Sea Creature Chance": "α",
    "Rift Time": "ф",
    "Pet Luck": "♣",
    "Health": "❤",
    "Farming Fortune": "☘",
    "Magic Find": "✯",
    "True Defense": "❂",
    "Foraging Fortune": "☘"
})

const pogObject = new PogObject("Kronos", {
    "Strength": 0,
    "Ferocity": 0,
    "Speed": 0,
    "Defense": 0,
    "Vitality": 0,
    "Mining Fortune": 0,
    "Cold Resistance": 0,
    "Intelligence": 0,
    "Sea Creature Chance": 0,
    "Rift Time": 0,
    "Pet Luck": 0,
    "Health": 0,
    "Farming Fortune": 0,
    "Magic Find": 0,
    "True Defense": 0,
    "Foraging Fortune": 0
}, "../../../Kronos/cake.json")

const hud = hudManager.createTextHud("CakeTimer", 3, 515, config.cakeTimer, true, { text: "§cUnknown", icons: [new Item(354)] })
updateCakeTimer()



function updateCakeTimer() {
    let longestRemaining = 0
    const missing = []
    for (let key in pogObject) {
        let timeRemaining = 172_800 - (Date.now() / 1000 - pogObject[key])
        if (timeRemaining < 0) missing.push(StatSymbols[key])
        if (timeRemaining > longestRemaining) longestRemaining = timeRemaining
    }
    if (!longestRemaining) return hud.setText("§cInactive!")
    const remainingTimeText = longestRemaining <= 3540 ? `${Math.ceil(longestRemaining / 60)}m` : `${Math.ceil(longestRemaining / 60 / 60)}h`
    if (missing.length) hud.setText(`§e${remainingTimeText} §c${missing.join(" ")}`)
    else hud.setText(`§a${remainingTimeText}`)
}

const step = reg.Step(() => updateCakeTimer()).setDelay(1)

config.registerListener("Cake Timer", state => {
    hud.setEnabled(state)
    state ? step.register() : step.unregister()
})
if (config.cakeTimer) step.register()



reg.Chat((type) => {
    eatTime = Date.now() / 1000
    pogObject[type] = eatTime
    pogObject.save()
    updateCakeTimer()
}).register()
.setChatCriteria(/^(?:Big )?Yum! You (?:gain|refresh) \+\d+. (.+?) for 48 hours!$/)