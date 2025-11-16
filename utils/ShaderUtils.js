import Shader from "ShaderLib"

let totalTicks = 0
register("tick", (tick) => totalTicks = tick)

export const chromaShader = new class {
    #shader = new Shader(
        FileLib.read("ShaderLib", "test/chroma.frag"),
        FileLib.read("ShaderLib", "test/chroma.vert")
    )

    start({ speed=6, size=30, saturation=0.9, partialTicks=Tessellator.partialTicks } = {}) {
        this.#shader.bind()
        // https://github.com/BiscuitDevelopment/SkyblockAddons/blob/main/src/main/java/codes/biscuit/skyblockaddons/shader/chroma/ChromaShader.java
        this.#shader.uniform1f("chromaSize", size * Client.getMinecraft()./*displayWidth*/field_71443_c / 100)
        this.#shader.uniform1f("timeOffset", (totalTicks + partialTicks) * (speed / 360))
        this.#shader.uniform1f("saturation", saturation)
    }

    stop() {
        this.#shader.unbind()
    }
}