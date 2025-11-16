// ----------------------------------------------------------------------------------------------- //
// Credit: https://discord.com/channels/119493402902528000/1109135083228643460/1233977991063670865 //
// ----------------------------------------------------------------------------------------------- //

let tit = null
let stit = null
let time = null
let startTime = null

const renderOverlay = register("renderOverlay", () => {
    if (!startTime) startTime = Date.now()
    const remainingTime = time - (Date.now() - startTime)

    if (remainingTime <= 0) {
        tit = null
        stit = null
        time = null
        startTime = null
        renderOverlay.unregister()
        return
    }

    const [x, y] = [Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2]

    Renderer.translate(x, y)
    Renderer.scale(4, 4)
    Renderer.drawStringWithShadow(tit, -(Renderer.getStringWidth(tit) / 2), -10)

    Renderer.translate(x, y)
    Renderer.scale(2, 2)
    Renderer.drawStringWithShadow(stit, -(Renderer.getStringWidth(stit) / 2), 5)
}).unregister()

export default function showTitle(title, subtitle, ms) {
    tit = title
    stit = subtitle
    time = ms
    startTime = null
    renderOverlay.register()
}