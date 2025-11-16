import PogObject from "PogData"
import { roundTo, roundHalf, drawTopStringWithShadow } from "./utils"
import TextHud from "./TextHud"
import CustomHud from "./CustomHud"

// ----------------------------------------------------------------------- //
// Modified version of: https://github.com/DocilElm/Krun/blob/main/Huds.js //
// ----------------------------------------------------------------------- //

export default class HudManager {
    constructor(moduleName, saveLocation, resetMessage=undefined) {
        /** @private */
        this.pogObject = new PogObject(moduleName, {}, saveLocation)
        /** @private */
        this.resetMessage = resetMessage

        /** @private */
        this.huds = []
        /** @private */
        this.selectedHud = undefined

        /** @private */
        this.gui = new Gui()
        this.gui.registerOpened(this._onOpened.bind(this))
        this.gui.registerClosed(this._onClosed.bind(this))
        this.gui.registerDraw(this._onDraw.bind(this))
        register("dragged", (dx, dy, _, __, button) => { if (Client.isInGui() && this.gui.isOpen()) this._onDrag(dx, dy, button) })
        this.gui.registerScrolled(this._onScroll.bind(this))
        this.gui.registerMouseReleased(this._onMouseRelease.bind(this))

        /** @private */
        register("renderOverlay", () => {
            if (this.gui.isOpen()) return
            const len = this.huds.length
            for (let i = 0; i < len; i++) {
                let hud = this.huds[i]
                if (hud._isEnabled && hud._isVisible) hud._draw()
            }
        })
    }



    /** @private */
    _onOpened() {
        this.huds.forEach(hud => hud?._guiOpened())
    }

    /** @private */
    _onClosed() {
        this.huds.forEach(hud => hud?._guiClosed())
        this._save()
    }

    /** @private */
    _onDraw(x, y) {
        Renderer.drawRect(Renderer.color(0, 0, 0, 150), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
        drawTopStringWithShadow("Drag to move\nScroll to resize\nMiddle-click to center\nRight-click to reset size\nShift + Right-click to reset pos")

        const len = this.huds.length

        if (this.selectedHud && (!this.selectedHud._isEnabled || !this.selectedHud._inBounds(x, y))) {
            this.selectedHud._isSelectedHud = false
            this.selectedHud = undefined
        }
        for (let i = 0; i < len; i++) {
            let hud = this.huds[i]
            if (!hud._isEnabled || hud._isSelectedHud) continue

            if (!this.selectedHud && hud._inBounds(x, y)) {
                this.selectedHud = hud
                hud._isSelectedHud = true
                continue
            }

            hud._drawGuiOpen()
        }
        if (this.selectedHud) this.selectedHud._drawGuiOpen() // Draw selected last
    }

    /** @private */
    _onDrag(dx, dy, button) {
        if (!this.selectedHud || button !== 0) return
        this.selectedHud.x = Math.min(Math.max(roundTo(roundHalf(this.selectedHud.x + dx), 1), 0), Math.max(Renderer.screen.getWidth() - this.selectedHud.w * this.selectedHud.scale, 0))
        this.selectedHud.y = Math.min(Math.max(roundTo(roundHalf(this.selectedHud.y + dy), 1), 0), Math.max(Renderer.screen.getHeight() - this.selectedHud.h * this.selectedHud.scale, 0))
        this.selectedHud._updateCenteredPos()
    }

    /** @private */
    _onScroll(_, __, direction) {
        if (!this.selectedHud) return
        if (direction === -1) this.selectedHud.scale = roundTo(this.selectedHud.scale - 0.05, 2)
        else {
            this.selectedHud.scale = roundTo(this.selectedHud.scale + 0.05, 2)
            this.selectedHud.x = Math.min(this.selectedHud.x, Math.max(Renderer.screen.getWidth() - this.selectedHud.w * this.selectedHud.scale, 0))
            this.selectedHud.y = Math.min(this.selectedHud.y, Math.max(Renderer.screen.getHeight() - this.selectedHud.h * this.selectedHud.scale, 0))
        }
        this.selectedHud._updateCenteredPos()
    }

    /** @private */
    _onMouseRelease(_, __, button) {
        if (this.selectedHud && button === 1 && Client.isShiftDown()) return this.selectedHud.resetPos()
        if (this.selectedHud && button === 1) return this.selectedHud.resetSize()
        if (this.selectedHud && button === 2) return this.selectedHud.toggleCentered()
    }

    /** @private */
    _save() {
        this.huds.forEach(hud => {
            this.pogObject[hud.name] = {
                x: hud.x,
                y: hud.y,
                scale: hud.scale,
                centered: hud.centered
            }
        })
        this.pogObject.save()
    }



    openGUI() {
        this.gui.open()
    }

    resetHuds() {
        this.huds.forEach(hud => {
            hud.resetSize()
            hud.resetPos()
        })
        this._save()
        if (this.resetMessage) ChatLib.chat(this.resetMessage)
    }



    createTextHud(name, x, y, enabled, visible, { scale=1, centered=false, borderInEdit=true, text="", fallbackText=undefined, icons=[] } = {}) {
        name = name.trim()
        if (this.huds.filter(hud => hud.name === name).length) throw new Error(`Hud with name '${name}' already exists!`)
        text = text.trim()
        const hud = new TextHud(name, x, y, scale, centered, this.pogObject[name] ?? {}, text, fallbackText, icons, borderInEdit, enabled, visible)
        this.huds.push(hud)
        return hud
    }

    createCustomHud(name, x, y, w, h, drawFunc, enabled, visible, { scale=1, centered=false, borderInEdit=true } = {}) {
        name = name.trim()
        if (this.huds.filter(hud => hud.name === name).length) throw new Error(`Hud with name '${name}' already exists!`)
        const hud = new CustomHud(name, x, y, scale, centered, this.pogObject[name] ?? {}, w, h, drawFunc, borderInEdit, enabled, visible)
        this.huds.push(hud)
        return hud
    }
}