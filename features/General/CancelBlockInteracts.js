// Credit: https://github.com/odtheking/Odin/blob/main/odinclient/src/main/kotlin/me/odinclient/features/impl/skyblock/CancelInteract.kt

import reg from "../../utils/Register"
import config from "../../config"
import location from "../../utils/Location"
import { getSkyblockID } from "../../utils/ItemUtils"

const whitelist = new Set(["minecraft:chest", "minecraft:trapped_chest", "minecraft:lever", "minecraft:stone_button", "minecraft:wooden_button"])
const blacklist = [net.minecraft.block.BlockHopper, net.minecraft.block.BlockWall, net.minecraft.block.BlockFence, net.minecraft.block.BlockFenceGate, net.minecraft.block.BlockTrapDoor]

const playerInteract = reg.PlayerInteract((_, __, event) => {
    if (event.action !== InteractAction.RIGHT_CLICK_BLOCK) return
    const heldItem = Player.getHeldItem()
    if (!heldItem) return
    const block = event.world./*getBlockState()*/func_180495_p(event.pos)./*getBlock()*/func_177230_c()
    if (whitelist.has(block.registryName)) return

    if (getSkyblockID(heldItem) === "ENDER_PEARL") return config.cancelInteract === 1 || config.cancelInteract === 3 ? cancel(event) : null

    if (config.cancelInteract < 2 || !blacklist.some(clazz => block instanceof clazz)) return

    if (heldItem.getLore().some(line => line.endsWith("RIGHT CLICK") && line.includes("Ability:"))) cancel(event)
})

config.registerListener("§4Cancel Interact", state => state && !location.PrivateIsland ? playerInteract.register() : playerInteract.unregister())
location.addListener("Area", () => config.cancelInteract && !location.PrivateIsland ? playerInteract.register() : playerInteract.unregister())
if (config.cancelInteract && !location.PrivateIsland) playerInteract.register()