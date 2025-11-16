import reg from "../../utils/Register"
import config from "../../config"
import hudManager from "../../hudManager"

const ProcessBuilder = Java.type("java.lang.ProcessBuilder")
const OutputStreamWriter = Java.type("java.io.OutputStreamWriter")
const BufferedWriter = Java.type("java.io.BufferedWriter")
const InputStreamReader = Java.type("java.io.InputStreamReader")
const BufferedReader = Java.type("java.io.BufferedReader")
const Base64Decoder = Java.type("java.util.Base64").getDecoder()
const StandardCharsets = Java.type("java.nio.charset.StandardCharsets")
const JavaString = Java.type("java.lang.String")
const fontRendererObj = Client.getMinecraft()./*fontRendererObj*/field_71466_p

const process = new ProcessBuilder("powershell.exe", "-NoExit", "-NoProfile", "-Command", "-").start()
const writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))
const reader = new BufferedReader(new InputStreamReader(process.getInputStream()))

register("gameUnload", () => {
    writer.close()
    reader.close()
    process.destroy()
})

const hud = hudManager.createTextHud("Spotify Playing", 4, 540-12, config.spotify, true, { text: "§d♬ " })
updateSpotifyInfo()

function updateSpotifyInfo() {
    new Thread(() => {
        writer.write("$title = (Get-Process Spotify -ErrorAction SilentlyContinue | Where-Object MainWindowTitle).MainWindowTitle; if (-not $title) { $title = \"\" }; [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($title))\n")
        writer.flush()
        const base64Line = reader.readLine()
        if (!base64Line) return hud.setText("§d♬ §cNot Open")
        let decodedLine = ""
        try { decodedLine = Base64Decoder.decode(base64Line) }
        catch (e) { return hud.setText("§d♬ §cNot Open") }
        const line = String(new JavaString(decodedLine, StandardCharsets.UTF_8))
        if (line === "Spotify Free" || line === "Spotify Premium" || line === "Spotify") return hud.setText("§d♬ §cPaused")
        let song = `§d♬ §a${line.replace(" - ", " §7-§b ")}`
        const maxWidth = Renderer.screen.getWidth() * 0.39
        if (hud.y > Renderer.screen.getHeight()*0.88 && Renderer.getStringWidth(song)*hud.scale > maxWidth) song = fontRendererObj./*trimStringToWidth()*/func_78269_a(song, maxWidth/hud.scale) + "..."
        hud.setText(song)
    }).start()
}

const step = reg.Step(() => updateSpotifyInfo()).setDelay(1)

config.registerListener("Spotify Playing", state => {
    hud.setEnabled(state)
    state ? step.register() : step.unregister()
})
if (config.spotify) step.register()