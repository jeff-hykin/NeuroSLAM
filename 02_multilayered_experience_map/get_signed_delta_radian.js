import { clipRadian360 } from "./clip_radian_360.js"
import { clipRadian180 } from "./clip_radian_180.js"

export function getSignedDeltaRadian(angle1, angle2) {
    // Get the signed delta angle from angle1 to angle2 handling the wrap from 2pi to 0.

    // Get the direction of the delta angle
    let dir = clipRadian180(angle2 - angle1);

    // Get the absolute delta angle, clipped within [0, 2pi]
    let delta_angle = Math.abs(clipRadian360(angle1) - clipRadian360(angle2));

    if (delta_angle < (2 * Math.PI - delta_angle)) {
        if (dir > 0) {
            return delta_angle;
        } else {
            return -delta_angle;
        }
    } else {
        if (dir > 0) {
            return 2 * Math.PI - delta_angle;
        } else {
            return -(2 * Math.PI - delta_angle);
        }
    }
}
