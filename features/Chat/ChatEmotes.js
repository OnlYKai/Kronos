// I'M SORRY //

import config from "../../config"
import PogObject from "../../../PogData"

const mvpEmotes = {
    "<3": "❤",
    ":star:": "✮",
    ":yes:": "✔",
    ":no:": "✖",
    ":java:": "☕",
    ":arrow:": "➜",
    ":shrug:": "¯_(ツ)_/¯",
    ":tableflip:": "(╯°□°）╯︵ ┻━┻",
    "o/": "( ﾟ◡ﾟ)/",
    ":123:": "123",
    ":totem:": "◎_◎",
    ":typing:": "✎...",
    ":maths:": "√(π+x)=L",
    ":snail:": "@'-'",
    ":thinking:": "(0.o?)",
    ":gimme:": "༼つ ◕_◕ ༽つ",
    ":wizard:": "('-')⊃━☆ﾟ.*･｡ﾟ",
    ":pvp:": "⚔",
    ":peace:": "✌",
    ":oof:": "OOF",
    ":puffer:": "<('O')>"
}

const giftEmotes = {
    ":sloth:": "( ⬩ ⊝ ⬩ )",
    ":cute:": "(✿ᴖ‿ᴖ)",
    ":yey:": "ヽ (◕◡◕) ﾉ",
    ":cat:": "= ＾● ⋏ ●＾ =",
    "h/": "ヽ(^◇^*)/",
    ":dab:": "<o/",
    ":dog:": "(ᵔᴥᵔ)",
    ":snow:": "☃",
    ":dj:": "ヽ(⌐■_■)ノ♬"
}

const pogObject = new PogObject("Kronos", { ":skull:": "☠" }, "../../../Kronos/customEmotes.json")

// Replace sent message
register("messageSent", (message, event) => {
    if (!config.chatEmotes) return
    if (/^\/(?!(pc|ac|gc|msg|w|r) )/.test(message)) return

    let emotes = {}
    if (config.chatEmotesMvp) emotes = { ...mvpEmotes }
    if (config.chatEmotesGift) emotes = { ...emotes, ...giftEmotes }
    if (config.chatEmotesCustom) emotes = { ...emotes, ...pogObject }

    let replaced = false
    Object.keys(emotes).forEach(key => {
        if ((key === "o/" || key === "h/")) {
            const regex = new RegExp(`(^| )(${key})($| )`, "g")
            if (!regex.test(message)) return
            message = message.replace(regex, `$1${emotes[key]}$3`)
        }
        else {
            if (!message.includes(key)) return
            message = message.replaceAll(key, emotes[key])
        }
        replaced = true
    })

    if (!replaced) return
    cancel(event)
    ChatLib.say(message)
})

// Autocomplete emotes
const guiClassNames = [ // No clue if the labymod one works, I found this list of classes in some other module ~I can't find anymore.~ Found it https://chattriggers.com/modules/v/CustomTabCompletions
    "net.optifine.gui.GuiChatOF",
    "net.minecraft.client.gui.GuiChat",
    "net.labymod.ingamechat.GuiChatCustom"
]
let tabStreak = 0
let autocompletes = []
let autocompleteMessage = undefined
register("guiKey", (_, keycode, gui) => {
    if (!config.chatEmotes) return
    if (keycode !== Keyboard.KEY_TAB) {
        tabStreak = 0
        if (autocompleteMessage) ChatLib.deleteChat(autocompleteMessage)
        autocompleteMessage = undefined
        return
    }
    if (!guiClassNames.includes(gui.class.getName())) return

    const textInput = gui./*inputField*/field_146415_a
    const originalText = textInput./*getText()*/func_146179_b()
    const originalCurorPos = textInput./*getCursorPosition()*/func_146198_h()

    if (/^\/(?!(pc|ac|gc|msg|w|r|rememote|delemote) )/.test(originalText)) return

    let emotes = {}
    if (/^\/(rememote|delemote)/.test(originalText)) emotes = { ...pogObject }
    else {
        emotes = { ...mvpEmotes, ...giftEmotes }
        if (config.chatEmotesCustom) emotes = { ...emotes, ...pogObject }
    }

    let textLeft = originalText.substring(0, originalCurorPos)
    let textRight = originalText.substring(originalCurorPos)

    if (tabStreak === 0) {
        if ((!/:[a-zA-Z0-9]*$/.test(textLeft) || (/(:[a-zA-Z0-9]*:)[a-zA-Z0-9]*$/.test(textLeft) && Object.keys(emotes).includes(/(:[a-zA-Z0-9]*:)[a-zA-Z0-9]*$/.exec(textLeft)[0]))) || (/^[a-zA-Z0-9]*:/.test(textRight) && Object.keys(emotes).includes(/(:[a-zA-Z0-9]*)$/.exec(textLeft)[0] + /^([a-zA-Z0-9]*:)/.exec(textRight)[0]))) return
        if (/^\/(rememote|delemote)(?! :[a-zA-Z0-9]*$)/.test(textLeft)) return

        autocompletes = Object.keys(emotes).filter(emote => emote.startsWith(/:[a-zA-Z0-9]*$/.exec(textLeft)[0]))
        if (!autocompletes.length) return autocompletes = []

        textLeft = textLeft.replace(/:[a-zA-Z0-9]*$/, autocompletes[tabStreak])
    }
    else {
        if (tabStreak === autocompletes.length) tabStreak = 0
        textLeft = textLeft.replace(/:[a-zA-Z0-9]*:$/, autocompletes[tabStreak])
    }

    if (/ :[a-zA-Z0-9]*:$/.test(textLeft) && /[^ ]/.test(textRight) && !textRight.startsWith(" ")) textRight = " " + textRight

    if (autocompleteMessage) ChatLib.deleteChat(autocompleteMessage)
    const autocompletesFormatted = []
    for (i = 0; i < autocompletes.length; i++) {
        if (i === tabStreak) autocompletesFormatted[i] = `§f${autocompletes[i]}§7`
        else autocompletesFormatted[i] = `§7${autocompletes[i]}`
    }
    autocompleteMessage = new Message(autocompletesFormatted.join(", "))
    autocompleteMessage.chat()

    textInput./*setText()*/func_146180_a(textLeft + textRight)
    textInput./*setCursorPosition()*/func_146190_e(textLeft.length)

    tabStreak++
})

register("command", (...args) => {
    if (args.length < 2 || !/:[a-zA-Z0-9]+:/.test(args[0])) return ChatLib.chat("Command usage: /addemote :EmoteName123: ༼つ ◕_◕ ༽つ")
    if (Object.keys(pogObject).includes(args[0])) return ChatLib.chat(`${args[0]} is already a custom emote!`)
    pogObject[args[0]] = args.slice(1).join(" ")
    pogObject.save()
    if (Object.keys(pogObject).includes(args[0])) ChatLib.chat(`Added ${args[0]} to custom emotes.`)
    else ChatLib.chat(`Failed to add ${args[0]} to custom emotes!`)
}).setName("addemote")

register("command", (arg) => {
    if (!arg) return ChatLib.chat("Command usage: /rememote :EmoteName123:")
    if (!Object.keys(pogObject).includes(arg)) return ChatLib.chat(`${arg} is not a custom emote!`)
    delete pogObject[arg]
    pogObject.save()
    if (!Object.keys(pogObject).includes(arg)) ChatLib.chat(`Removed ${arg} from custom emotes.`)
    else ChatLib.chat(`Failed to remove ${arg} from custom emotes!`)
}).setName("rememote").setAliases(["delemote"])

let emoteCountdown = 0
register("chat", (event) => {
    if (!config.chatEmotes) return
    const message = ChatLib.getChatMessage(event, false)
    if (message.startsWith("Available through Rank Gifting:")) return emoteCountdown = 10
    if (emoteCountdown < 0) return
    if (emoteCountdown > 0) return emoteCountdown -= 1
    emoteCountdown -= 1
    cancel(event)
    ChatLib.chat(ChatLib.getChatMessage(event, true))
    if (!Object.keys(pogObject).length) return
    ChatLib.chat("§aCustom Emotes:")
    for (let key in pogObject) {
        ChatLib.chat(`§6${key}§f  -  ${pogObject[key]}`)
    }
}).setChatCriteria(/^Available through Rank Gifting:$|^(?:|\^-\^|:sloth:|:cute:|:yey:|:cat:|h\/|:dab:|:dog:|:snow:|:dj:|\^_\^)  -  .*$/)