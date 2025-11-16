import reg from "../../utils/Register"
import config from "../../config"

// -------------------------------------------------------------------------------------- //
// Fixed version of: https://github.com/Ninjune/coleweight/blob/main/render/superCraft.js //
// -------------------------------------------------------------------------------------- //

const postGuiRender = reg.PostGuiRender((_, __, gui) => {
    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiChest && Player.getContainer().getName().endsWith("Recipe"))) return
    const supercraftItem = Player.getContainer().getStackInSlot(32)
    if (supercraftItem?.getName() !== "§aSupercraft") return
    const lore = supercraftItem.getLore()
    if (lore.some(line => line.includes("§aMax: §b"))) return

    const emptyLineIdx = lore.findIndex(line => line.removeFormatting().trim() === "")
    const lore1 = lore.slice(1, emptyLineIdx)
    const lore2 = lore.slice(emptyLineIdx)

    const maxPerMaterial = lore1.map(material => {
        const amounts = material.removeFormatting().replaceAll(",", "").match(/ . (\d+)\/(\d+) .+/)
        return Math.floor(amounts[1] / amounts[2])
    })
    const max = Math.min(...maxPerMaterial)

    supercraftItem.setLore(...lore1, `§aMax: §b${max}`, ...lore2)
})

config.registerListener("Max Supercraft Amount", state => state ? postGuiRender.register() : postGuiRender.unregister())
if (config.supercraftAmount) postGuiRender.register()