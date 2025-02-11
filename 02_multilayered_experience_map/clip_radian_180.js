// Helper function to clip radian to the range of -pi to pi
export function clipRadian180(angle) {
    while (angle > Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    return angle
}
