// Helper function to clip radian to the range of 0 to 2pi
export function clipRadian360(angle) {
    while (angle >= 2 * Math.PI) angle -= 2 * Math.PI
    while (angle < 0) angle += 2 * Math.PI
    return angle
}
