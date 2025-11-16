export function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max)
}

export function roundTo(number, places) {
    const multiplier = 10 ** places
    return Math.round(number * multiplier) / multiplier
}

export function lerp(o, n, p=Tessellator.partialTicks) {
    return o + (n - o) * p
}

export function in3DBounds(point, min, max) {
    return (
        point[0] >= min[0] && point[0] <= max[0] &&
        point[1] >= min[1] && point[1] <= max[1] &&
        point[2] >= min[2] && point[2] <= max[2]
      )
}