// https://discord.com/channels/119493402902528000/688773480954855537/1114615214785183816
export function getItemFromNBT(nbtStr) {
    if (!nbtStr) return null
    let nbt = net.minecraft.nbt.JsonToNBT./*getTagFromJson()*/func_180713_a(nbtStr) // Get MC NBT object from string
    let count = nbt./*getByte()*/func_74771_c("Count") // get byte
    let id = nbt./*getString()*/func_74779_i("id") // get string
    let damage = nbt./*getShort()*/func_74765_d("Damage") // get short
    let tag = nbt./*getTag()*/func_74781_a("tag") // get tag
    let item = new Item(id) // create ct item object
    item.setStackSize(count)
    item = item.getItemStack() // convert to mc object
    item./*setItemDamage()*/func_77964_b(damage) // set damage of mc item object
    if (tag) item./*setTagCompound()*/func_77982_d(tag) // set tag of mc item object
    item = new Item(item) // convert back to ct object
    return item
}



export function getExtraAttributes(item) {
    if (!item) return null
    if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
    const extraAttributes = item.getNBT().getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
    return extraAttributes
}

export function getSkyblockID(item) {
    if (!item) return null
    if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
    const id = getExtraAttributes(item)?.getString("id")
    return id
}

export function getUUID(item) {
    if (!item) return null
    if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
    const uuid = getExtraAttributes(item)?.getString("uuid")
    return uuid
}

export function getTimestamp(item) {
    if (!item) return null
    if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
    const timestamp = getExtraAttributes(item)?.getLong("timestamp")
    return timestamp
}

export function getEnchantments(item) {
    if (!item) return null
    if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
    const enchantments = getExtraAttributes(item)?.getCompoundTag("enchantments")
    return enchantments
}

export function getEnchantment(item, enchantment) {
    if (!item) return null
    if (item instanceof net.minecraft.item.ItemStack) item = new Item(item)
    enchantment = getEnchantments(item)?.getInteger(enchantment)
    return enchantment
}