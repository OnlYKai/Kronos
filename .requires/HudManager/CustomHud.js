import Hud from "./Hud"

export default class CustomHud extends Hud {
    constructor(name, x, y, scale, centered, obj, w, h, drawFunc, borderInEdit, enabled, visible) {
        super(name, x, y, scale, centered, obj, w, h, borderInEdit, enabled, visible)

        this.draw = drawFunc
    }

    _draw() {
        this.draw(this.x, this.y, this.w, this.h, this.scale)
    }

    setWidth(w) {
        this.w = w
        this._updateCenteredPos()
    }

    setHeight(h) {
        this.h = h
        this._updateCenteredPos()
    }
}