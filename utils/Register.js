import scheduleTask from "./ServerTicks"

class Trigger {
    constructor(triggerType, func) {
        /** @private */
        this._trigger = register(triggerType, func).unregister()
        /** @private */
        this.triggerType = triggerType
        /** @private */
        this.func = func
        /** @private */
        this._registered = false
        /** @private */
        this._internalOnRegister = undefined
        /** @private */
        this._internalOnUnregister = undefined
        /** @private */
        this._onRegister = undefined
        /** @private */
        this._onUnregister = undefined
    }
    compareTo(trigger) { return this._trigger.compareTo(trigger instanceof Trigger ? trigger._trigger : trigger) }
    setPriority(priority) { this._trigger.setPriority(priority); return this }
    trigger(args) { this._trigger.trigger(args) }



    register() {
        if (this._registered) return this
        this._trigger.register()
        this._registered = true
        if (this._internalOnRegister) this._internalOnRegister()
        if (this._onRegister) this._onRegister()
        return this
    }

    unregister() {
        if (!this._registered) return this
        this._trigger.unregister()
        this._registered = false
        if (this._internalOnUnregister) this._internalOnUnregister()
        if (this._onUnregister) this._onUnregister()
        return this
    }



    reregister() {
        return this.unregister().register()
    }

    isRegistered() {
        return this._registered
    }

    setOnRegister(func) {
        if (typeof func !== "function" && typeof func !== "undefined") throw TypeError("setOnRegister must be a function or undefined!")
        this._onRegister = func
        return this
    }

    setOnUnregister(func) {
        if (typeof func !== "function" && typeof func !== "undefined") throw TypeError("setOnUnregister must be a function or undefined!")
        this._onUnregister = func
        return this
    }
}





class ChatTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
    addParameter(parameter) { this._trigger.addParameter(parameter); return this }
    addParameters(...parameters) { this._trigger.addParameters(...parameters); return this }
    setCaseInsensitive() { this._trigger.setCaseInsensitive(); return this }
    setChatCriteria(chatCriteria) { this._trigger.setChatCriteria(chatCriteria); return this }
    setContains() { this._trigger.setContains(); return this }
    setCriteria(chatCriteria) { this._trigger.setCriteria(chatCriteria); return this }
    setEnd() { this._trigger.setEnd(); return this }
    setExact() { this._trigger.setExact(); return this }
    setParameter(parameter) { this._trigger.setParameter(parameter); return this }
    setParameters(...parameters) { this._trigger.setParameters(...parameters); return this }
    setStart() { this._trigger.setStart(); return this }
    triggerIfCanceled(bool) { this._trigger.triggerIfCanceled(bool); return this }
}



class ClassFilterTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
    evalTriggerType(args) { return this._trigger.evalTriggerType(args) }
    setFilteredClass(clazz) { this._trigger.setFilteredClass(clazz); return this }
    setFilteredClasses(classes) { this._trigger.setFilteredClasses(classes); return this }
}



class CommandTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
    setAliases(...args) { this._trigger.setAliases(...args); return this }
    setCommandName(commandName, overrideExisting=false) { this._trigger.setCommandName(commandName, overrideExisting); return this }
    setName(commandName, overrideExisting=false) { this._trigger.setName(commandName, overrideExisting); return this }
    setTabCompletions(...args) { this._trigger.setTabCompletions(...args); return this }
}



class EventTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
    triggerIfCanceled(bool) { this._trigger.triggerIfCanceled(bool); return this }
}



class ForgeTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
}



class RegularTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
}



class SoundPlayTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
    setCriteria(soundNameCriteria) { this._trigger.setCriteria(soundNameCriteria); return this }
}



class StepTrigger extends Trigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
    setDelay(delay) { this._trigger.setDelay(delay); return this }
    setFps(fps) { this._trigger.setFps(fps); return this }
}





class PacketTrigger extends ClassFilterTrigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
}



class RenderEntityTrigger extends ClassFilterTrigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
}



class RenderTileEntityTrigger extends ClassFilterTrigger {
    constructor(triggerType, func) {
        super(triggerType, func)
    }
}





class EntityJoinWorldTrigger extends ForgeTrigger {
    constructor(triggerType, func) {
        super(triggerType, (event) => scheduleTask(() => func(event), 2))
    }

    triggerAllEntitiesOnRegister(bool) {
        bool ? this._internalOnRegister = () => { if (World.isLoaded()) World.getAllEntities().forEach(entity => this.func({ entity: entity.getEntity(), world: World.getWorld() })) } : this._internalOnRegister = undefined
        return this
    }
}





/**
 * Registers a new trigger that runs before an action bar message is received.
 *
 * Passes through multiple arguments:
 * - Any number of chat criteria variables
 * - The chat event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerActionBar(func) { return new ChatTrigger("actionBar", func) }

/**
 * Registers a new trigger that runs whenever the player has left clicked on an entity
 *
 * Passes through three arguments:
 * - The {@link Entity com.chattriggers.ctjs.minecraft.wrappers.objects.entity.Entity} that is being hit
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerAttackEntity(func) { return new EventTrigger("attackEntity", func) }

/**
 * Registers a new trigger that runs before the player breaks a block
 *
 * Passes through one argument:
 * - The block
 *
 * @return The trigger for additional modification
 */
function registerBlockBreak(func) { return new RegularTrigger("blockBreak", func) }

/**
 * Registers a new trigger that runs before a chat message is received.
 *
 * Passes through multiple arguments:
 * - Any number of chat criteria variables
 * - The chat event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerChat(func) { return new ChatTrigger("chat", func) }

/**
 * Registers a new trigger that runs whenever the user clicks on a clickable
 * chat component
 *
 * Passes through two arguments:
 * - The {@link TextComponent com.chattriggers.ctjs.minecraft.objects.message.TextComponent}
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerChatComponentClicked(func) { return new EventTrigger("chatComponentClicked", func) }

/**
 * Registers a new trigger that runs whenever the user hovers over a
 * hoverable chat component
 *
 * Passes through two arguments:
 * - The {@link TextComponent com.chattriggers.ctjs.minecraft.objects.message.TextComponent}
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerChatComponentHovered(func) { return new EventTrigger("chatComponentHovered", func) }

/**
 * Registers a new trigger that runs before a mouse button is being pressed or released.
 *
 * Passes through four arguments:
 * - The mouse x position
 * - The mouse y position
 * - The mouse button
 * - The mouse button state (true if button is pressed, false otherwise)
 *
 * @return The trigger for additional modification
 */
function registerClicked(func) { return new RegularTrigger("clicked", func) }

/**
 * Registers a new command that will run the method provided.
 *
 * Passes through multiple arguments:
 * - The arguments supplied to the command by the user
 *
 * @return The trigger for additional modification
 */
function registerCommand(func) { return new CommandTrigger("command", func) }

/**
 * Registers a new trigger that runs while a mouse button is being held down.
 *
 * Passes through five arguments:
 * - The mouse delta x position (relative to last frame)
 * - The mouse delta y position (relative to last frame)
 * - The mouse x position
 * - The mouse y position
 * - The mouse button
 *
 * @return The trigger for additional modification
 */
function registerDragged(func) { return new RegularTrigger("dragged", func) }

/**
 * Registers a new trigger that runs before the block highlight box is drawn.
 *
 * Passes through two arguments:
 * - The draw block highlight event's position
 * - The draw block highlight event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerDrawBlockHighlight(func) { return new EventTrigger("drawBlockHighlight", func) }

/**
 * Registers a new trigger that runs before an item is dropped.
 *
 * Passes through five arguments:
 * - The {@link Item} that is dropped up
 * - The {@link PlayerMP com.chattriggers.ctjs.minecraft.wrappers.objects.PlayerMP} that dropped the item
 * - The item's position vector
 * - The item's motion vector
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerDropItem(func) { return new EventTrigger("dropItem", func) }

/**
 * Registers a new trigger that runs before an entity is damaged
 *
 * Passes through two arguments:
 * - The target Entity that is damaged
 * - The PlayerMP attacker
 *
 * @return The trigger for additional modification
 */
function registerEntityDamage(func) { return new RegularTrigger("entityDamage", func) }

/**
 * Registers a new trigger that runs before an entity dies
 *
 * Passes through one argument:
 * - The Entity that died
 *
 * @return The trigger for additional modification
 */
function registerEntityDeath(func) { return new RegularTrigger("entityDeath", func) }

/**
 * Registers a new trigger that runs after the game loads.
 *
 * This runs after the initial loading of the game directly after scripts are
 * loaded and after "/ct load" happens.
 *
 * @return The trigger for additional modification
 */
function registerGameLoad(func) { return new RegularTrigger("gameLoad", func) }

/**
 * Registers a new trigger that runs before the game unloads.
 *
 * This runs before shutdown of the JVM and before "/ct load" happens.
 *
 * @return The trigger for additional modification
 */
function registerGameUnload(func) { return new RegularTrigger("gameUnload", func) }

/**
 * Registers a new trigger that runs when a gui is closed.
 *
 * Passes through one argument:
 * - The gui that was closed
 *
 * @return The trigger for additional modification
 */
function registerGuiClosed(func) { return new RegularTrigger("guiClosed", func) }

/**
 * Registers a new trigger that runs before the gui background is drawn
 * This is useful for drawing custom backgrounds.
 *
 * Passes through one argument:
 * - The {@link MCGuiScreen GuiScreen} that is being drawn
 *
 * @return The trigger for additional modification
 */
function registerGuiDrawBackground(func) { return new EventTrigger("guiDrawBackground", func) }

/**
 * Registers a new trigger that runs whenever a key is typed with a gui open
 *
 * Passes through four arguments:
 * - The character pressed (eg. 'd')
 * - The key code pressed (eg. 41)
 * - The gui
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerGuiKey(func) { return new EventTrigger("guiKey", func) }

/**
 * Registers a new trigger that runs whenever the mouse is clicked with a
 * gui open
 *
 * Passes through five arguments:
 * - The mouse x position
 * - The mouse y position
 * - The mouse button
 * - The gui
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerGuiMouseClick(func) { return new EventTrigger("guiMouseClick", func) }

/**
 * Registers a new trigger that runs whenever a mouse button held and dragged
 * with a gui open
 *
 * Passes through five arguments:
 * - The mouse x position
 * - The mouse y position
 * - The mouse button
 * - The gui
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerGuiMouseDrag(func) { return new EventTrigger("guiMouseDrag", func) }

/**
 * Registers a new trigger that runs whenever a mouse button is released
 * with a gui open
 *
 * Passes through five arguments:
 * - The mouse x position
 * - The mouse y position
 * - The mouse button
 * - The gui
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerGuiMouseRelease(func) { return new EventTrigger("guiMouseRelease", func) }

/**
 * Registers a new trigger that runs when a new gui is first opened.
 *
 * Passes through one argument:
 * - The gui opened event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerGuiOpened(func) { return new EventTrigger("guiOpened", func) }

/**
 * Registers a new trigger that runs as a gui is rendered
 *
 * Passes through three arguments:
 * - The mouse x position
 * - The mouse y position
 * - The gui
 *
 * @return The trigger for additional modification
 */
function registerGuiRender(func) { return new RegularTrigger("guiRender", func) }

/**
 * Registers a new trigger that runs whenever a block is left clicked
 *
 * Note: this is not continuously called while the block is being broken, only once
 * when first left clicked.
 *
 * Passes through two arguments:
 * - The {@link Block com.chattriggers.ctjs.minecraft.wrappers.objects.block.Block} being hit
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerHitBlock(func) { return new EventTrigger("hitBlock", func) }

/**
 * Registers a new trigger that runs when a tooltip is being rendered.
 * This allows for the user to modify what text is in the tooltip, and even the
 * ability to cancel rendering completely.
 *
 * Passes through three arguments:
 * - The list of lore to modify.
 * - The {@link Item} that this lore is attached to.
 * - The cancellable event.
 *
 * @return The trigger for additional modification
 */
function registerItemTooltip(func) { return new EventTrigger("itemTooltip", func) }

/**
 * Registers a new trigger that runs before a message is sent in chat.
 *
 * Passes through two arguments:
 * - The message
 * - The message event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerMessageSent(func) { return new EventTrigger("messageSent", func) }

/**
 * Registers a new trigger that runs before a noteblock is changed.
 *
 * Passes through four arguments:
 * - The note block change event's Vector3f position
 * - The note block change event's note's name
 * - The note block change event's octave
 * - The note block change event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerNoteBlockChange(func) { return new EventTrigger("noteBlockChange", func) }

/**
 * Registers a new trigger that runs before a noteblock is played.
 *
 * Passes through four arguments:
 * - The note block play event's Vector3f position
 * - The note block play event's note's name
 * - The note block play event's octave
 * - The note block play event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerNoteBlockPlay(func) { return new EventTrigger("noteBlockPlay", func) }

/**
 * Registers a new trigger that runs whenever a packet is sent to the client from the server
 *
 * Passes through two arguments:
 * - The packet
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerPacketReceived(func) { return new PacketTrigger("packetReceived", func) }

/**
 * Registers a new trigger that runs whenever a packet is sent from the client to the server
 *
 * Passes through two arguments:
 * - The packet
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerPacketSent(func) { return new PacketTrigger("packetSent", func) }

/**
 * Registers a new trigger that runs before an item is picked up.
 *
 * Passes through five arguments:
 * - The {@link Item} that is picked up
 * - The {@link PlayerMP com.chattriggers.ctjs.minecraft.wrappers.objects.PlayerMP} that picked up the item
 * - The item's position vector
 * - The item's motion vector
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerPickupItem(func) { return new EventTrigger("pickupItem", func) }

/**
 * Registers a new trigger that runs before the player interacts.
 *
 * In 1.8.9, the following events will activate this trigger:
 * - Right clicking a block
 * - Right clicking the air
 *
 * In 1.12.2, the following events will activate this trigger:
 * - Left clicking a block
 * - Left clicking air
 * - Right clicking an entity
 * - Right clicking a block
 * - Right clicking an item
 * - Right clicking air
 *
 * Passes through three arguments:
 * - The {@link ClientListener.PlayerInteractAction}
 * - The position of the target as a Vector3f
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerPlayerInteract(func) { return new EventTrigger("playerInteract", func) }

/**
 * Registers a new trigger that runs when a player joins the world.
 *
 * Maximum is one per tick. Any extras will queue and run in later ticks.
 * This trigger is asynchronous.
 *
 * Passes through one argument:
 * - The {@link PlayerMP com.chattriggers.ctjs.minecraft.wrappers.objects.PlayerMP} object
 *
 * @return The trigger for additional modification
 */
function registerPlayerJoined(func) { return new RegularTrigger("playerJoined", func) }

/**
 * Registers a new trigger that runs when a player leaves the world.
 *
 * Maximum is one per tick. Any extras will queue and run in later ticks.
 * This trigger is asynchronous.
 *
 * Passes through one argument:
 * - The name of the player that left
 *
 * @return The trigger for additional modification
 */
function registerPlayerLeft(func) { return new RegularTrigger("playerLeft", func) }

/**
 * Registers a new trigger that runs after the current screen is rendered
 *
 * Passes through three arguments:
 * - The mouseX
 * - The mouseY
 * - The GuiScreen
 *
 * @return The trigger for additional modification
 */
function registerPostGuiRender(func) { return new RegularTrigger("postGuiRender", func) }

/**
 * Registers a new trigger that runs after an entity is rendered
 *
 * Passes through three arguments:
 * - The {@link Entity com.chattriggers.ctjs.minecraft.wrappers.objects.entity.Entity}
 * - The position as a Vector3f
 * - The partial ticks
 *
 * @return The trigger for additional modification
 */
function registerPostRenderEntity(func) { return new RenderEntityTrigger("postRenderEntity", func) }

/**
 * Registers a new trigger that runs after a tile entity is rendered
 *
 * Passes through three arguments:
 * - The TileEntity
 * - The position as a Vector3f
 * - The partial ticks
 *
 * @return The trigger for additional modification
 */
function registerPostRenderTileEntity(func) { return new RenderTileEntityTrigger("postRenderTileEntity", func) }

/**
 * Registers a new trigger that runs before the items in the gui are drawn
 *
 * Passes through five arguments:
 * - The mouseX position
 * - The mouseY position
 * - The MC Slot
 * - The GuiContainer
 *
 * @return The trigger for additional modification
 */
function registerPreItemRender(func) { return new RegularTrigger("preItemRender", func) }

/**
 * Registers a new trigger that runs before the player's air level is drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderAir(func) { return new EventTrigger("renderAir", func) }

/**
 * Registers a new trigger that runs before the player's armor bar is drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderArmor(func) { return new EventTrigger("renderArmor", func) }

/**
 * Registers a new trigger that runs before the boss health bar is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderBossHealth(func) { return new EventTrigger("renderBossHealth", func) }

/**
 * Registers a new trigger that runs before the chat is drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderChat(func) { return new EventTrigger("renderChat", func) }

/**
 * Registers a new trigger that runs before the crosshair is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderCrosshair(func) { return new EventTrigger("renderCrosshair", func) }

/**
 * Registers a trigger that runs before the debug screen is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderDebug(func) { return new EventTrigger("renderDebug", func) }

/**
 * Registers a new trigger that runs whenever an entity is rendered
 *
 * Passes through four arguments:
 * - The {@link Entity com.chattriggers.ctjs.minecraft.wrappers.objects.entity.Entity}
 * - The position as a Vector3f
 * - The partial ticks
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderEntity(func) { return new RenderEntityTrigger("renderEntity", func) }

/**
 * Registers a new trigger that runs before the player's experience is being drawn.
 *
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderExperience(func) { return new EventTrigger("renderExperience", func) }

/**
 * Registers a new trigger that runs before the player's food is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderFood(func) { return new EventTrigger("renderFood", func) }

/**
 * Registers a new trigger that runs before the player's hand is drawn.
 *
 * Passes through one argument:
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderHand(func) { return new EventTrigger("renderHand", func) }

/**
 * Registers a new trigger that runs before the player's health is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderHealth(func) { return new EventTrigger("renderHealth", func) }

/**
 * Registers a new trigger that runs before the player's helmet overlay is drawn.
 * This triggers when a pumpkin is on the player's head
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderHelmet(func) { return new EventTrigger("renderHelmet", func) }

/**
 * Registers a new trigger that runs before the player's hotbar is drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderHotbar(func) { return new EventTrigger("renderHotbar", func) }

/**
 * Registers a new trigger that runs before each item is drawn into a GUI.
 *
 * Passes through four arguments:
 * - The {@link Item}
 * - The x position
 * - The y position
 * - The event, which can be cancelled.
 *
 * @return The trigger for additional modification
 */
function registerRenderItemIntoGui(func) { return new EventTrigger("renderItemIntoGui", func) }

/**
 * Registers a new trigger that runs before each item overlay (stack size and damage bar) is drawn.
 *
 * Passes through four arguments:
 * - The {@link Item}
 * - The x position
 * - The y position
 * - The event, which can be cancelled.
 *
 * @return The trigger for additional modification
 */
function registerRenderItemOverlayIntoGui(func) { return new EventTrigger("renderItemOverlayIntoGui", func) }

/**
 * Registers a new trigger that runs before the jump bar is drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderJumpBar(func) { return new EventTrigger("renderJumpBar", func) }

/**
 * Registers a new trigger that runs before the player's mount's health is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderMountHealth(func) { return new EventTrigger("renderMountHealth", func) }

/**
 * Registers a new trigger that runs before the overlay is drawn.
 *
 * Passes through one argument:
 * - The render event, which cannot be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderOverlay(func) { return new EventTrigger("renderOverlay", func) }

/**
 * Registers a new trigger that runs before the player list is being drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderPlayerList(func) { return new EventTrigger("renderPlayerList", func) }

/**
 * Registers a new trigger that runs before the portal effect is drawn.
 *
 * Passes through one argument:
 * - The render event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderPortal(func) { return new EventTrigger("renderPortal", func) }

/**
 * Registers a new trigger that runs before the scoreboard is drawn.
 *
 * Passes through one argument:
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderScoreboard(func) { return new EventTrigger("renderScoreboard", func) }

/**
 * Registers a new trigger that runs before a slot is drawn in a container
 * This is useful for hiding "background" items in containers used as GUIs.
 *
 * Passes through three arguments:
 * - The {@link Slot} being drawn
 * - The MC GUIScreen that is being drawn
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderSlot(func) { return new EventTrigger("renderSlot", func) }

/**
 * Registers a new trigger that runs before the hovered slot square is drawn.
 *
 * Passes through six arguments:
 * - The mouseX position
 * - The mouseY position
 * - The Slot
 * - The GuiContainer
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderSlotHighlight(func) { return new EventTrigger("renderSlotHighlight", func) }

/**
 * Registers a new trigger that runs whenever a tile entity is rendered
 *
 * Passes through four arguments:
 * - The TileEntity
 * - The position as a Vector3f
 * - The partial ticks
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderTileEntity(func) { return new RenderTileEntityTrigger("renderTileEntity", func) }

/**
 * Registers a new trigger that runs before the title and subtitle are drawn.
 *
 * Passes through three arguments:
 * - The title
 * - The subtitle
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerRenderTitle(func) { return new EventTrigger("renderTitle", func) }

/**
 * Registers a new trigger that runs before the world is drawn.
 *
 * Passes through one argument:
 * - Partial ticks elapsed
 *
 * @return The trigger for additional modification
 */
function registerRenderWorld(func) { return new RegularTrigger("renderWorld", func) }

/**
 * Registers a new trigger that runs before a screenshot is taken.
 *
 * Passes through two arguments:
 * - The name of the screenshot
 * - The screenshot event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerScreenshotTaken(func) { return new EventTrigger("screenshotTaken", func) }

/**
 * Registers a new trigger that runs before the mouse is scrolled.
 *
 * Passes through three arguments:
 * - The mouse x position
 * - The mouse y position
 * - The scroll direction: 1, -1
 *
 * @return The trigger for additional modification
 */
function registerScrolled(func) { return new RegularTrigger("scrolled", func) }

/**
 * Registers a new trigger that runs whenever the player connects to a server
 *
 * Passes through one argument:
 * - The event, which cannot be cancelled
 *
 * @return The trigger for additional modification
 */
function registerServerConnect(func) { return new EventTrigger("serverConnect", func) }

/**
 * Registers a new trigger that runs whenever the player disconnects from a server
 *
 * Passes through two arguments:
 * - The event, which cannot be cancelled
 *
 * @return The trigger for additional modification
 */
function registerServerDisconnect(func) { return new RegularTrigger("serverDisconnect", func) }

/**
 * Registers a new trigger that runs before a sound is played.
 *
 * Passes through six arguments:
 * - The sound event's position
 * - The sound event's name
 * - The sound event's volume
 * - The sound event's pitch
 * - The sound event's category's name
 * - The sound event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerSoundPlay(func) { return new SoundPlayTrigger("soundPlay", func) }

/**
 * Registers a new trigger that runs whenever a particle is spawned
 *
 * Passes through three arguments:
 * - The {@link Particle com.chattriggers.ctjs.minecraft.wrappers.objects.Particle}
 * - The {@link MCEnumParticleTypes net.minecraft.util.EnumParticleTypes}
 * - The event, which can be cancelled
 *
 * @return The trigger for additional modification
 */
function registerSpawnParticle(func) { return new EventTrigger("spawnParticle", func) }

/**
 * Registers a new trigger that runs in predictable intervals. (60 per second by default)
 *
 * Passes through one argument:
 * - Steps elapsed
 *
 * @return The trigger for additional modification
 */
function registerStep(func) { return new StepTrigger("step", func) }

/**
 * Registers a new trigger that runs before every game tick.
 *
 * Passes through one argument:
 * - Ticks elapsed
 *
 * @return The trigger for additional modification
 */
function registerTick(func) { return new RegularTrigger("tick", func) }

/**
 * Registers a trigger that runs before the world loads.
 *
 * @return The trigger for additional modification
 */
function registerWorldLoad(func) { return new RegularTrigger("worldLoad", func) }

/**
 * Registers a new trigger that runs before the world unloads.
 *
 * @return The trigger for additional modification
 */
function registerWorldUnload(func) { return new RegularTrigger("worldUnload", func) }



function registerForgeEvent(eventClass, func) { return new ForgeTrigger(eventClass, func) }

function registerEntityJoinWorld(func) { return new EntityJoinWorldTrigger(net.minecraftforge.event.entity.EntityJoinWorldEvent, func) }





const reg = Object.freeze({
    ActionBar: registerActionBar,
    AttackEntity: registerAttackEntity,
    BlockBreak: registerBlockBreak,
    Chat: registerChat,
    ChatComponentClicked: registerChatComponentClicked,
    ChatComponentHovered: registerChatComponentHovered,
    Clicked: registerClicked,
    Command: registerCommand,
    Dragged: registerDragged,
    DrawBlockHighlight: registerDrawBlockHighlight,
    DropItem: registerDropItem,
    EntityDamage: registerEntityDamage,
    EntityDeath: registerEntityDeath,
    GameLoad: registerGameLoad,
    GameUnload: registerGameUnload,
    GuiClosed: registerGuiClosed,
    GuiDrawBackground: registerGuiDrawBackground,
    GuiKey: registerGuiKey,
    GuiMouseClick: registerGuiMouseClick,
    GuiMouseDrag: registerGuiMouseDrag,
    GuiMouseRelease: registerGuiMouseRelease,
    GuiOpened: registerGuiOpened,
    GuiRender: registerGuiRender,
    HitBlock: registerHitBlock,
    ItemTooltip: registerItemTooltip,
    MessageSent: registerMessageSent,
    NoteBlockChange: registerNoteBlockChange,
    NoteBlockPlay: registerNoteBlockPlay,
    PacketReceived: registerPacketReceived,
    PacketSent: registerPacketSent,
    PickupItem: registerPickupItem,
    PlayerInteract: registerPlayerInteract,
    PlayerJoined: registerPlayerJoined,
    PlayerLeft: registerPlayerLeft,
    PostGuiRender: registerPostGuiRender,
    PostRenderEntity: registerPostRenderEntity,
    PostRenderTileEntity: registerPostRenderTileEntity,
    PreItemRender: registerPreItemRender,
    RenderAir: registerRenderAir,
    RenderArmor: registerRenderArmor,
    RenderBossHealth: registerRenderBossHealth,
    RenderChat: registerRenderChat,
    RenderCrosshair: registerRenderCrosshair,
    RenderDebug: registerRenderDebug,
    RenderEntity: registerRenderEntity,
    RenderExperience: registerRenderExperience,
    RenderFood: registerRenderFood,
    RenderHand: registerRenderHand,
    RenderHealth: registerRenderHealth,
    RenderHelmet: registerRenderHelmet,
    RenderHotbar: registerRenderHotbar,
    RenderItemIntoGui: registerRenderItemIntoGui,
    RenderItemOverlayIntoGui: registerRenderItemOverlayIntoGui,
    RenderJumpBar: registerRenderJumpBar,
    RenderMountHealth: registerRenderMountHealth,
    RenderOverlay: registerRenderOverlay,
    RenderPlayerList: registerRenderPlayerList,
    RenderPortal: registerRenderPortal,
    RenderScoreboard: registerRenderScoreboard,
    RenderSlot: registerRenderSlot,
    RenderSlotHighlight: registerRenderSlotHighlight,
    RenderTileEntity: registerRenderTileEntity,
    RenderTitle: registerRenderTitle,
    RenderWorld: registerRenderWorld,
    ScreenshotTaken: registerScreenshotTaken,
    Scrolled: registerScrolled,
    ServerConnect: registerServerConnect,
    ServerDisconnect: registerServerDisconnect,
    SoundPlay: registerSoundPlay,
    SpawnParticle: registerSpawnParticle,
    Step: registerStep,
    Tick: registerTick,
    WorldLoad: registerWorldLoad,
    WorldUnload: registerWorldUnload,

    ForgeEvent: registerForgeEvent,
    EntityJoinWorld: registerEntityJoinWorld
})

export default reg