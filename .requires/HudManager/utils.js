export function roundTo(number, places) {
    const multiplier = 10 ** places
    return Math.round(number * multiplier) / multiplier
}

export function roundHalf(number) {
    return Math.round(number * 2) / 2
}

export function drawTopStringWithShadow(text) {
    const lines = text.split("\n")
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        Renderer.drawStringWithShadow(
            line,
            ((Renderer.screen.getWidth() - Renderer.getStringWidth(line)) / 2),
            (1 + i*9)
        )
    }
}

export function drawCenteredStringWithShadow(text, centerLine) {
    const lines = text.split("\n")
    if (centerLine === undefined) centerLine = lines.length / 2 + 0.5
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        Renderer.drawStringWithShadow(
            line,
            ((Renderer.screen.getWidth() - Renderer.getStringWidth(line)) / 2),
            ((Renderer.screen.getHeight() - 9) / 2) + ((i+1 - centerLine) * 9)
        )
    }
}

// retainTransforms has to be ENABLED!!!
export function drawRectBorder(color, x, y, w, h, lw=1) {
    //x -= lw/2
    //y -= lw/2
    //w += lw
    //h += lw
    Renderer.drawLine(color, x, y, x+w, y, lw)
    Renderer.drawLine(color, x, y+h, x+w, y+h, lw)
    Renderer.drawLine(color, x, y, x, y+h, lw)
    Renderer.drawLine(color, x+w, y, x+w, y+h, lw)
}