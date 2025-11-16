import RenderLib from "../../RenderLibV2J"
import drawBeaconBeam from "../../BeaconBeam"
import { getLerpedPosition } from "./EntityUtils"
import { lerp, clamp } from "./Math"



const renderManager = Renderer.getRenderManager()
const RenderHelper = net.minecraft.client.renderer.RenderHelper
const OpenGlHelper = net.minecraft.client.renderer.OpenGlHelper
const GLAllocation = net.minecraft.client.renderer.GLAllocation
const fontRendererObj = Client.getMinecraft()./*fontRendererObj*/field_71466_p
const renderItem = Client.getMinecraft()./*getRenderItem()*/func_175599_af()

const createDirectFloatBuffer = (floats) => GLAllocation./*createDirectFloatBuffer()*/func_74529_h(floats.length).put(floats).flip()



const File = Java.type("java.io.File")
const ImageIO = Java.type("javax.imageio.ImageIO")
const DynamicTexture = Java.type("net.minecraft.client.renderer.texture.DynamicTexture")
const TextureManager = Client.getMinecraft()./*getTextureManager()*/func_110434_K()
const UUID = Java.type("java.util.UUID")
/**
 * Returns any file as a ResourceLocation. Must be called from a Rendering Context! Only call once and store ResourceLocation!
 * @param {string} path Relative path from ".minecraft" folder
 * @returns {ResourceLocation} ResourceLocation
 */
export function newExternalResourceLocation(path) {
    const img = ImageIO.read(new File(path))
    const tex = new DynamicTexture(img)
    const res = TextureManager./*getDynamicTextureLocation()*/func_110578_a("external_" + UUID.randomUUID(), tex)
    return res
}



export function renderWaypoint(x, y, z, r, g, b, { w=1, h=1, text="", beam=true, tracer=false, phase=false } = {}) {
    RenderLib.drawInnerEspBox(x, y, z, w, h, r, g, b, 0.5, phase)
    RenderLib.drawEspBoxV2(x, y, z, w, h, w, r, g, b, 1, phase, 3)
    if (beam) drawBeaconBeam(x-w/2, y+h, z-w/2, r, g, b, 1, !phase, 100)
    if (tracer) drawTracer(x, y+h/2, z, r, g, b, 1, phase, 3)
    if (text) renderNametag(x, y, z, text)
}



export function drawTracer(x, y, z, r, g, b, a, phase=true, lineWidth=2) {
    const player = Player.getPlayer()
    if (!player) return
    let [pX, pY, pZ] = getLerpedPosition(player)
    pY += player./*getEyeHeight()*/func_70047_e()
    RenderLib.drawLine(pX, pY, pZ, x, y, z, r, g, b, a, phase, lineWidth)
}



export function renderNametag(x, y, z, text, { color=0xffffff, background=true, centerVetical=false, h=0 } = {}) {
    const [pX, pY, pZ] = getLerpedPosition(Player.getPlayer())
    const distance = Math.hypot(x-pX, y- (pY + Player.getPlayer()./*getEyeHeight()*/func_70047_e()), z-pZ)
    const scale = clamp(distance/250, 0.053, 0.3)
    if (centerVetical) y -= (h-8*scale)/2
    Tessellator.drawString(text, x, y+h, z, color, background, scale, false)
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



const playerLightDirection = createDirectFloatBuffer([0.0, 1.0, 0.0, 0.0])
const playerLightDiffuse = createDirectFloatBuffer([1.0, 1.0, 1.0, 1.0])
const playerLightAmbient = createDirectFloatBuffer([0.33, 0.33, 0.33, 1.0])
// retainTransforms should be DISABLED!!!
export function drawPlayer(player, { rotate=false, rotationYaw=0, rotationPitch=0, headYaw=0, headPitch=0, partialTicks=Tessellator.partialTicks } = {}) {
    if (!player) return

    Renderer.translate(0, 0, 50)
    Renderer.scale(1, -1)
    Renderer.colorize(1, 1, 1, 1)

    const originalPrevPitch = player./*prevRotationPitch*/field_70127_C
    const originalPrevYawHead = player./*prevRotationYawHead*/field_70758_at
    const originalPrevYawOffset = player./*prevRenderYawOffset*/field_70760_ar
    const originalPitch = player./*rotationPitch*/field_70125_A
    const originalYawHead = player./*rotationYawHead*/field_70759_as
    const originalYawOffset = player./*renderYawOffset*/field_70761_aq

    if (!rotate) {
        GlStateManager./*rotate()*/func_179114_b(rotationPitch, 1, 0, 0)
        const yaw = lerp(originalPrevYawOffset, originalYawOffset, partialTicks)
        GlStateManager./*rotate()*/func_179114_b(yaw - rotationYaw, 0, 1, 0)

        player./*prevRotationPitch*/field_70127_C = headPitch
        player./*prevRotationYawHead*/field_70758_at = yaw + headYaw
        //player./*prevRenderYawOffset*/field_70760_ar = yaw
        player./*rotationPitch*/field_70125_A = headPitch
        player./*rotationYawHead*/field_70759_as = yaw + headYaw
        //player./*renderYawOffset*/field_70761_aq = yaw
    }

    //RenderHelper./*enableStandardItemLighting()*/func_74519_b() // suck my balls minecraft, i hate lighting
    renderManager./*setRenderShadow()*/func_178633_a(false)
    GL11.glEnable(GL11.GL_LIGHTING)
    GL11.glEnable(GL11.GL_LIGHT0)
    GL11.glEnable(GL11.GL_COLOR_MATERIAL)
    //GL11.glColorMaterial(GL11.GL_FRONT_AND_BACK, GL11.GL_AMBIENT_AND_DIFFUSE) // idk ChatGPT said to use it, but it doenst make a difference visually
    //GL11.glMatrixMode(GL11.GL_MODELVIEW) // idk ChatGPT said to use it, but it doenst make a difference visually
    GL11.glLight(GL11.GL_LIGHT0, GL11.GL_POSITION, playerLightDirection)
    //GL11.glLight(GL11.GL_LIGHT0, GL11.GL_DIFFUSE, playerLightDiffuse) // it's default values anyway, so might as well not change it
    GL11.glLight(GL11.GL_LIGHT0, GL11.GL_AMBIENT, playerLightAmbient)

    renderManager./*doRenderEntity()*/func_147939_a(player, 0, 0, 0, 0, partialTicks, true)
    //const renderPlayer = new net.minecraft.client.renderer.entity.RenderPlayer(renderManager)
    //renderPlayer./*doRender()*/func_76986_a(player, 0, 0, 0, 0, partialTicks)

    GL11.glDisable(GL11.GL_COLOR_MATERIAL)
    GL11.glDisable(GL11.GL_LIGHT0)
    GL11.glDisable(GL11.GL_LIGHTING)
    renderManager./*setRenderShadow()*/func_178633_a(true)
    RenderHelper./*disableStandardItemLighting()*/func_74518_a()

    if (!rotate) {
        player./*prevRotationPitch*/field_70127_C = originalPrevPitch
        player./*prevRotationYawHead*/field_70758_at = originalPrevYawHead
        //player./*prevRenderYawOffset*/field_70760_ar = originalPrevYawOffset
        player./*rotationPitch*/field_70125_A = originalPitch
        player./*rotationYawHead*/field_70759_as = originalYawHead
        //player./*renderYawOffset*/field_70761_aq = originalYawOffset
    }

    Renderer.finishDraw()
}



// retainTransforms should be DISABLED!!!
export function drawItemWithOverlay(itemStack, x, y, scale=1) {
    if (!itemStack) return

    Renderer.translate(x, y)
    Renderer.scale(scale)
    renderItem./*renderItemIntoGUI()*/func_180450_b(itemStack, 0, 0)
    renderItem./*renderItemOverlays()*/func_175030_a(fontRendererObj, itemStack, 0, 0)
    Renderer.finishDraw()
}