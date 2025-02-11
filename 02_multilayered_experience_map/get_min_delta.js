export function getMinDelta(d1, d2, max) {
    // Get the minimum delta distance between two values assuming a wrap to zero at max
    let delta = Math.min(Math.abs(d1 - d2), max - Math.abs(d1 - d2));
    return delta;
}
