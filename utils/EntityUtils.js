export function noSqrt3DDistance(mcEntity1, mcEntity2) {
    const dx = mcEntity1./*posX*/field_70165_t - mcEntity2./*posX*/field_70165_t
    const dy = mcEntity1./*posY*/field_70163_u - mcEntity2./*posY*/field_70163_u
    const dz = mcEntity1./*posZ*/field_70161_v - mcEntity2./*posZ*/field_70161_v
    return dx * dx + dy * dy + dz * dz
}

export function getLerpedPosition(mcEntity, partialTicks=Tessellator.partialTicks) {
    return [
        mcEntity./*lastTickPosX*/field_70142_S + (mcEntity./*posX*/field_70165_t - mcEntity./*lastTickPosX*/field_70142_S) * partialTicks,
        mcEntity./*lastTickPosY*/field_70137_T + (mcEntity./*posY*/field_70163_u - mcEntity./*lastTickPosY*/field_70137_T) * partialTicks,
        mcEntity./*lastTickPosZ*/field_70136_U + (mcEntity./*posZ*/field_70161_v - mcEntity./*lastTickPosZ*/field_70136_U) * partialTicks,
        mcEntity./*width*/field_70130_N,
        mcEntity./*height*/field_70131_O
    ]
}

const MathHelper = Java.type("net.minecraft.util.MathHelper")
export function getBodyRotation(mcEntity) {
    const prevRenderYawOffset = mcEntity./*prevRenderYawOffset*/field_70760_ar
    const renderYawOffset = mcEntity./*renderYawOffset*/field_70761_aq
    return MathHelper./*wrapAngleTo180_float()*/func_76142_g(prevRenderYawOffset + (renderYawOffset - prevRenderYawOffset) * Tessellator.partialTicks)
}

const UnitEnum = Object.freeze({
    "k": 1_000,
    "M": 1_000_000
})
export function getHpFromName(name) {
    const hp = name?.removeFormatting()?.match(/([\d\.]+)([kM])?\/([\d\.]+)([kM])?❤/)
    if (!hp) return null

    const unitMultCurrent = UnitEnum[hp[2]] ?? 1
    const unitMultMax = UnitEnum[hp[4]] ?? 1

    const currentHP = Math.round(hp[1] * unitMultCurrent)
    const maxHP = Math.round(hp[3] * unitMultMax)

    return { current: currentHP, max: maxHP }
}