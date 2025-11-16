import Hud from "./Hud"

export default class TextHud extends Hud {
    constructor(name, x, y, scale, centered, obj, text, fallbackText, icons, borderInEdit, enabled, visible) {
        super(name, x, y, scale, centered, obj, undefined, undefined, borderInEdit, enabled, visible)

        this._iconScaleSingle = 0.9
        this._iconScaleMulti = 0.6

        this.text = text
        this.fallbackText = fallbackText
        this.icons = icons

        this.textLines = []

        this._isGuiOpen = false

        this._updateSizeFromText()
        this._updateCenteredPos()
    }



    _draw() {
        if (this.textLines.length && (this.centered || this.icons.length)) {
            const len = this.textLines.length
            for (let i = 0; i < len; i++) {
                let line = this.textLines[i]
                let icon = this.icons[i]
                if (icon) icon.draw(this.x + (this.centered ? (this.w - Renderer.getStringWidth(line) - (16 * this._iconScaleMulti + 3)) * this.scale / 2 : 0), this.y + (9 * i * this.scale) - ((16 * this._iconScaleMulti - 9) * this.scale / 2), this.scale * this._iconScaleMulti)
                Renderer.translate(this.x, this.y)
                Renderer.scale(this.scale)
                if (this.centered) Renderer.drawStringWithShadow(line, (this.w - Renderer.getStringWidth(line) - (icon ? (16 * this._iconScaleMulti + 3) : 0)) / 2 + (icon ? 16 * this._iconScaleMulti + 3 : 0), 9 * i)
                else Renderer.drawStringWithShadow(line, icon ? 16 * this._iconScaleMulti + 3 : 0, 9 * i)
            }
        }
        else {
            const icon = this.icons[0]
            if (icon) icon.draw(this.x, this.y - ((16 * this._iconScaleSingle - 9) * this.scale / 2), this.scale * this._iconScaleSingle)
            Renderer.translate(this.x, this.y)
            Renderer.scale(this.scale)
            Renderer.drawStringWithShadow(this.text, icon ? 16 * this._iconScaleSingle + 3 : 0, 0)
        }
    }

    _guiOpened() {
        this._isGuiOpen = true
        if (!this.text) this.setText(this.fallbackText ? this.fallbackText : this.name)
    }

    _guiClosed() {
        this._isGuiOpen = false
        if (this.text === this.fallbackText || this.text === this.name) this.setText("")
    }

    _updateSizeFromText() {
        if (!this.text.includes("\n")) {
            this.w = Renderer.getStringWidth(this.text) + (this.icons[0] ? 16 * this._iconScaleSingle + 3 : 0)
            this.h = 9
            return this.textLines = []
        }
        this.textLines = this.text.split("\n")
        this.w = 0
        this.textLines.forEach((line, i) => this.w = Math.max(this.w, Renderer.getStringWidth(line) + (this.icons[i] ? 16 * this._iconScaleMulti + 3 : 0)))
        this.h = 9 * this.textLines.length
    }



    setText(text) {
        const trimmedText = text.trim()
        if (trimmedText === this.text) return
        this.text = trimmedText
        this._updateSizeFromText()
        this._updateCenteredPos()
    }

    setIcons(items) {
        this.icons = items
        this._updateSizeFromText()
        this._updateCenteredPos()
    }
}