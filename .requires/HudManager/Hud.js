import { drawCenteredStringWithShadow, drawRectBorder } from "./utils"

// ---------------------------------------------------------------------- //
// Modified version of: https://github.com/DocilElm/Krun/blob/main/Hud.js //
// ---------------------------------------------------------------------- //

export default class Hud {
    constructor(name, x, y, scale, centered, obj, w, h, borderInEdit, enabled, visible) {
        this.name = name

        this.defaultX = x
        this.defaultY = y
        this.defaultScale = scale
        this.defaultCentered = centered

        this.x = obj.x ?? this.defaultX
        this.y = obj.y ?? this.defaultY
        this.scale = obj.scale ?? this.defaultScale
        this.centered = obj.centered ?? this.defaultCentered

        this.w = w ?? 0
        this.h = h ?? 0

        this.borderInEdit = borderInEdit
        this._isEnabled = enabled
        this._isVisible = visible
        this._isSelectedHud = false

        this._updateCenteredPos()
    }



    _drawGuiOpen() {
        this._draw()

        if (this.borderInEdit) {
            Renderer.translate(this.x, this.y, 500)
            //Renderer.scale(this.scale)
            //Renderer.setDrawMode(2)
            //Renderer.drawRect(this._isSelectedHud ? Renderer.color(150, 150, 150, 255) : Renderer.color(90, 90, 90, 255), 0, 0, this.w, this.h)
            Renderer.retainTransforms(true)
            drawRectBorder(this._isSelectedHud ? Renderer.color(150, 150, 150, 255) : Renderer.color(90, 90, 90, 255), 0, 0, this.w*this.scale, this.h*this.scale)
            Renderer.retainTransforms(false)
        }
        if (this._isSelectedHud) drawCenteredStringWithShadow(`§d${this.name}\n§6X: §a${this.x} §6Y: §a${this.y}\n§6Scale: §a${this.scale}x`, 1)
    }

    _inBounds(x, y) {
        const [x1, y1, x2, y2] = [this.x, this.y, this.x + this.w * this.scale, this.y + this.h * this.scale]
        return x >= x1 && x <= x2 && y >= y1 && y <= y2
    }

    _updateCenteredPos() {
        if (this.centered) this.x = Renderer.screen.getWidth() / 2 - this.w * this.scale / 2
    }



    resetPos() {
        this.centered = this.defaultCentered
        this.x = this.defaultX
        this.y = this.defaultY
        this._updateCenteredPos()
    }

    resetSize() {
        this.scale = this.defaultScale
        this.x = Math.min(this.x, Math.max(Renderer.screen.getWidth() - this.w * this.scale, 0))
        this.y = Math.min(this.y, Math.max(Renderer.screen.getHeight() - this.h * this.scale, 0))
        this._updateCenteredPos()
    }

    toggleCentered() {
        this.centered = !this.centered
        this._updateCenteredPos()
    }

    setEnabled(state) {
        this._isEnabled = state
    }

    setVisibility(state) {
        this._isVisible = state
    }
}