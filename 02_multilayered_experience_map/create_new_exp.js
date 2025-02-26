import { getSignedDeltaRadian } from "./get_signed_delta_radian.js"
import { clipRadian180 } from "./clip_radian_180.js"

export function createNewExp({curExpId, newExpId, vtId, xGc, yGc, zGc, curYawHdc, curHeight, expGlobals}) {
    // used but not modified
    const {
        ACCUM_DELTA_X,
        ACCUM_DELTA_Y,
        ACCUM_DELTA_Z,
        ACCUM_DELTA_YAW,
    } = expGlobals
    
    // modified
    var {
        VT,
        EXPERIENCES 
    } = expGlobals

    // Add link information to the current experience for the new experience
    // including the experience_id, odo distance to the experience, 
    // odo heading (relative to the current experience's facing) to the experience, 
    // odo delta facing (relative to the current experience's facing).

    let currentExp = EXPERIENCES[curExpId];

    currentExp.numlinks++;
    currentExp.links[currentExp.numlinks - 1] = {
        exp_id: newExpId,
        d_xy: Math.sqrt(ACCUM_DELTA_X ** 2 + ACCUM_DELTA_Y ** 2),
        d_z: ACCUM_DELTA_Z,
        heading_yaw_exp_rad: getSignedDeltaRadian(currentExp.yaw_exp_rad, -Math.atan2(ACCUM_DELTA_Y, ACCUM_DELTA_X)),
        facing_yaw_exp_rad: getSignedDeltaRadian(currentExp.yaw_exp_rad, ACCUM_DELTA_YAW)
    };

    // Create the new experience, which initially has no links
    let newExp = {
        x_gc: xGc,
        y_gc: yGc,
        z_gc: zGc,
        yaw_hdc: curYawHdc,
        height_hdc: curHeight,
        vt_id: vtId,
        x_exp: currentExp.x_exp + ACCUM_DELTA_X,
        y_exp: currentExp.y_exp + ACCUM_DELTA_Y,
        z_exp: currentExp.z_exp + ACCUM_DELTA_Z,
        yaw_exp_rad: clipRadian180(ACCUM_DELTA_YAW),
        numlinks: 0,
        links: []
    };

    // Save the new experience in the EXPERIENCES array
    EXPERIENCES[newExpId] = newExp;

    // Add this experience ID to the VT for efficient lookup
    let vt = VT[vtId];
    vt.numExp++;
    vt.EXPERIENCES[vt.numExp - 1] = { id: newExpId };

    return {
        EXPERIENCES,
        VT,
    }
}
