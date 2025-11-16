import config from "../../config"
import hudManager from "../../hudManager"
import { drawItemWithOverlay, drawPlayer, drawRectBorder } from "../../utils/RenderUtils"
import { chromaShader } from "../../utils/ShaderUtils"
import { getItemFromNBT } from "../../utils/ItemUtils"
import PogObject from "../../../PogData"

const RenderHelper = net.minecraft.client.renderer.RenderHelper

const pogObject = new PogObject("Kronos", { equipment: [] }, "../../../Kronos/equipment.json")

const padding = 5
const slot = 18
const itemOffset = (slot-16)/2

const equipment = pogObject.equipment.map(nbt => getItemFromNBT(nbt)?.getItemStack())
let row1 = []
let row2 = []
let row3 = []
let hotbar = []
let armor = []

function updateItems() {
    const items = Player.getInventory().getItems().map(item => item?.getItemStack())
    hotbar = items.slice(0, 9)
    row1 = items.slice(9, 18)
    row2 = items.slice(18, 27)
    row3 = items.slice(27, 36)
    armor = items.slice(36).reverse()
}

const tick = register("tick", updateItems).unregister()

register("postGuiRender", (_, __, gui) => {
    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiChest && Player.getContainer().getName() === "Your Equipment and Stats")) return
    const container = Player.getContainer()
    for (let i = 0; i < 4; i++) {
        let item = container.getStackInSlot(1+9*(i+1))
        if (!item) continue
        if (item.getRegistryName() === "minecraft:skull") {
            equipment[i] = item.getItemStack()
            pogObject.equipment[i] = item.getRawNBT()
        }
        else {
            equipment[i] = null
            pogObject.equipment[i] = null
        }
    }
})

register("gameUnload", () => pogObject.save())

function draw(x, y, w, h, scale) {
    const chroma = config.inventoryHudChroma
    const colorBg = config.inventoryHudBgColor
    const colorAccent = config.inventoryHudAccentColor
    const colorBgSection = config.inventoryHudShowSectionBg ? config.inventoryHudSectionBgColor : 0x00000000

    const partialTicks = Tessellator.partialTicks

    GlStateManager./*disableAlpha()*/func_179118_c()

    if (chroma) chromaShader.start({ speed: 3, size: 50, partialTicks })
    Renderer.retainTransforms(true)

    Renderer.translate(x, y)
    Renderer.scale(scale)
    Renderer.drawRect(colorBg, 0, 0, w, h)
    Renderer.drawLine(colorAccent, 0, 0, w, 0, 2)
    Renderer.drawLine(colorAccent, 0, h, w, h, 2)

    Renderer.translate(0, 0, 100)
    Renderer.drawRect(colorBgSection, padding, padding, slot, slot*4)
    Renderer.drawRect(colorBgSection, slot+padding*2, padding, slot*9, slot*4)
    Renderer.drawRect(colorBgSection, slot*10+padding*3, padding, slot, slot*4)
    drawRectBorder(colorAccent, padding, padding, slot, slot*4)
    drawRectBorder(colorAccent, slot+padding*2, padding, slot*9, slot*4)
    drawRectBorder(colorAccent, slot*10+padding*3, padding, slot, slot*4)

    Renderer.retainTransforms(false)
    if (chroma) chromaShader.stop()

    RenderHelper./*enableGUIStandardItemLighting()*/func_74520_c()
    for (let i = 0; i < equipment.length; i++) drawItemWithOverlay(equipment[i], x+(padding+itemOffset)*scale, y+(padding+slot*i+itemOffset)*scale, scale)
    for (let i = 0; i < row1.length; i++) drawItemWithOverlay(row1[i], x+(slot+padding*2+slot*i+itemOffset)*scale, y+(padding+itemOffset)*scale, scale)
    for (let i = 0; i < row2.length; i++) drawItemWithOverlay(row2[i], x+(slot+padding*2+slot*i+itemOffset)*scale, y+(padding+slot+itemOffset)*scale, scale)
    for (let i = 0; i < row3.length; i++) drawItemWithOverlay(row3[i], x+(slot+padding*2+slot*i+itemOffset)*scale, y+(padding+slot*2+itemOffset)*scale, scale)
    for (let i = 0; i < hotbar.length; i++) drawItemWithOverlay(hotbar[i], x+(slot+padding*2+slot*i+itemOffset)*scale, y+(padding+slot*3+itemOffset)*scale, scale)
    for (let i = 0; i < armor.length; i++) drawItemWithOverlay(armor[i], x+(slot*10+padding*3+itemOffset)*scale, y+(padding+slot*i+itemOffset)*scale, scale)
    RenderHelper./*disableStandardItemLighting()*/func_74518_a() 

    if (config.inventoryHudShowPlayer) {
        Renderer.translate(x+(slot*11+padding*4+20)*scale, y+(h-((slot*4+padding*2)-30*1.8)/2)*scale)
        Renderer.scale(scale*30)
        drawPlayer(Player.getPlayer(), { rotationYaw: -30, rotationPitch: 25, headYaw: -10, headPitch: 20, partialTicks })
    }

    GlStateManager./*enableAlpha()*/func_179141_d()
}

const hud = hudManager.createCustomHud("Inventory", 20, 200, config.inventoryHudShowPlayer ? slot*11+padding*5+40 : slot*11+padding*4, slot*4+padding*2, draw, config.inventoryHud, true, { borderInEdit: false })

config.registerListener("🌒Show Player", state => state ? hud.setWidth(slot*11+padding*5+40) : hud.setWidth(slot*11+padding*4))

function enable() {
    tick.register()
    hud.setEnabled(true)
}

function disable() {
    tick.unregister()
    hud.setEnabled(false)
}

config.registerListener("Inventory HUD", state => state ? enable() : disable())
if (config.inventoryHud) enable()