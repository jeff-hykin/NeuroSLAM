import { getMinDelta } from "./get_min_delta.js"
import { createNewExp } from "./create_new_exp.js"
import { clipRadian180 } from "./clip_radian_180.js"
import { getSignedDeltaRadian } from "./get_signed_delta_radian.js"

export function expMapIteration(vt_id, transV, yawRotV, heightV, xGc, yGc, zGc, curYawHdc, curHeight) {
    // Define global variables (make sure they are initialized elsewhere)
    global EXPERIENCES, CUR_EXP_ID, NUM_EXPS, MIN_DELTA_EM;
    global DELTA_EXP_GC_HDC_THRESHOLD;
    global VT, PREV_VT_ID;
    global GC_X_DIM, GC_Y_DIM, GC_Z_DIM;
    global YAW_HEIGHT_HDC_Y_DIM, YAW_HEIGHT_HDC_H_DIM;
    global ACCUM_DELTA_X, ACCUM_DELTA_Y, ACCUM_DELTA_Z, ACCUM_DELTA_YAW;
    global DELTA_EM;
    global EXP_CORRECTION, EXP_LOOPS;
    global EXP_HISTORY;

    // Update accumulative deltas for position and rotation
    ACCUM_DELTA_YAW = clipRadian180(ACCUM_DELTA_YAW + yawRotV);
    ACCUM_DELTA_X += transV * Math.cos(ACCUM_DELTA_YAW);
    ACCUM_DELTA_Y += transV * Math.sin(ACCUM_DELTA_YAW);
    ACCUM_DELTA_Z += heightV;

    // Compute delta for each dimension
    let minDeltaX = getMinDelta(EXPERIENCES[CUR_EXP_ID].x_gc, xGc, GC_X_DIM);
    let minDeltaY = getMinDelta(EXPERIENCES[CUR_EXP_ID].y_gc, yGc, GC_Y_DIM);
    let minDeltaZ = getMinDelta(EXPERIENCES[CUR_EXP_ID].z_gc, zGc, GC_Z_DIM);
    
    let minDeltaYaw = getMinDelta(EXPERIENCES[CUR_EXP_ID].yaw_hdc, curYawHdc, YAW_HEIGHT_HDC_Y_DIM);
    let minDeltaHeight = getMinDelta(EXPERIENCES[CUR_EXP_ID].height_hdc, curHeight, YAW_HEIGHT_HDC_H_DIM);
    
    let minDeltaYawReversed = getMinDelta(EXPERIENCES[CUR_EXP_ID].yaw_hdc, (YAW_HEIGHT_HDC_Y_DIM / 2) - curYawHdc, YAW_HEIGHT_HDC_Y_DIM);
    minDeltaYaw = Math.min(minDeltaYaw, minDeltaYawReversed);
    
    let delta_em = Math.sqrt(minDeltaX ** 2 + minDeltaY ** 2 + minDeltaZ ** 2 + minDeltaYaw ** 2 + minDeltaHeight ** 2);
    DELTA_EM.push(delta_em);

    // Check if new experience should be created
    if (VT[vt_id].numExp === 0 || delta_em > DELTA_EXP_GC_HDC_THRESHOLD) {
        NUM_EXPS++;
        createNewExp(CUR_EXP_ID, NUM_EXPS, vt_id, xGc, yGc, zGc, curYawHdc, curHeight);

        PREV_EXP_ID = CUR_EXP_ID;
        CUR_EXP_ID = NUM_EXPS;

        ACCUM_DELTA_X = 0;
        ACCUM_DELTA_Y = 0;
        ACCUM_DELTA_Z = 0;
        ACCUM_DELTA_YAW = EXPERIENCES[CUR_EXP_ID].yaw_exp_rad;

    } else if (vt_id !== PREV_VT_ID) {
        // If VT has changed, search for the matching experience
        let matched_exp_id = 0;
        let matched_exp_count = 0;
        let delta_em_arr = [];

        for (let search_id = 0; search_id < VT[vt_id].numExp; search_id++) {
            let exp = EXPERIENCES[VT[vt_id].EXPERIENCES[search_id].id];

            let minDeltaYaw = getMinDelta(exp.yaw_hdc, curYawHdc, YAW_HEIGHT_HDC_Y_DIM);
            let minDeltaHeight = getMinDelta(exp.height_hdc, curHeight, YAW_HEIGHT_HDC_Y_DIM);

            delta_em_arr[search_id] = Math.sqrt(
                getMinDelta(exp.x_gc, xGc, GC_X_DIM) ** 2 +
                getMinDelta(exp.y_gc, yGc, GC_Y_DIM) ** 2 +
                getMinDelta(exp.z_gc, yGc, GC_Z_DIM) ** 2 +
                minDeltaYaw ** 2 + minDeltaHeight ** 2
            );

            if (delta_em_arr[search_id] < DELTA_EXP_GC_HDC_THRESHOLD) {
                matched_exp_count++;
            }
        }

        if (matched_exp_count > 1) {
            // Multiple matching experiences - avoid matching due to hash collisions
        } else {
            let [min_delta, min_delta_id] = minDelta(delta_em_arr);
            MIN_DELTA_EM.push(min_delta);
            if (min_delta < DELTA_EXP_GC_HDC_THRESHOLD) {
                matched_exp_id = VT[vt_id].EXPERIENCES[min_delta_id].id;

                // Check if there's already a link between experiences
                let link_exists = false;
                for (let link_id = 0; link_id < EXPERIENCES[CUR_EXP_ID].numlinks; link_id++) {
                    if (EXPERIENCES[CUR_EXP_ID].links[link_id].exp_id === matched_exp_id) {
                        link_exists = true;
                        break;
                    }
                }

                if (!link_exists) {
                    // Create a link if it doesn't exist
                    let link = {
                        exp_id: matched_exp_id,
                        d_xy: Math.sqrt(ACCUM_DELTA_X ** 2 + ACCUM_DELTA_Y ** 2),
                        d_z: ACCUM_DELTA_Z,
                        heading_yaw_exp_rad: getSignedDeltaRadian(EXPERIENCES[CUR_EXP_ID].yaw_exp_rad, Math.atan2(ACCUM_DELTA_Y, ACCUM_DELTA_X)),
                        facing_yaw_exp_rad: getSignedDeltaRadian(EXPERIENCES[CUR_EXP_ID].yaw_exp_rad, ACCUM_DELTA_YAW)
                    };
                    EXPERIENCES[CUR_EXP_ID].links.push(link);
                    EXPERIENCES[CUR_EXP_ID].numlinks++;
                }
            }

            if (matched_exp_id === 0) {
                NUM_EXPS++;
                createNewExp(CUR_EXP_ID, NUM_EXPS, vt_id, xGc, yGc, zGc, curYawHdc, curHeight);
                matched_exp_id = NUM_EXPS;
            }

            PREV_EXP_ID = CUR_EXP_ID;
            CUR_EXP_ID = matched_exp_id;

            ACCUM_DELTA_X = 0;
            ACCUM_DELTA_Y = 0;
            ACCUM_DELTA_Z = 0;
            ACCUM_DELTA_YAW = EXPERIENCES[CUR_EXP_ID].yaw_exp_rad;
        }
    }

    // Perform experience map correction iteratively
    for (let i = 0; i < EXP_LOOPS; i++) {
        for (let exp_id = 0; exp_id < NUM_EXPS; exp_id++) {
            for (let link_id = 0; link_id < EXPERIENCES[exp_id].numlinks; link_id++) {
                let e0 = exp_id;
                let e1 = EXPERIENCES[exp_id].links[link_id].exp_id;

                // Compute where e0 thinks e1 should be based on link info
                let lx = EXPERIENCES[e0].x_exp + EXPERIENCES[e0].links[link_id].d_xy * Math.cos(EXPERIENCES[e0].yaw_exp_rad + EXPERIENCES[e0].links[link_id].heading_yaw_exp_rad);
                let ly = EXPERIENCES[e0].y_exp + EXPERIENCES[e0].links[link_id].d_xy * Math.sin(EXPERIENCES[e0].yaw_exp_rad + EXPERIENCES[e0].links[link_id].heading_yaw_exp_rad);
                let lz = EXPERIENCES[e0].z_exp + EXPERIENCES[e0].links[link_id].d_z;

                // Apply corrections
                EXPERIENCES[e0].x_exp += (EXPERIENCES[e1].x_exp - lx) * EXP_CORRECTION;
                EXPERIENCES[e0].y_exp += (EXPERIENCES[e1].y_exp - ly) * EXP_CORRECTION;
                EXPERIENCES[e0].z_exp += (EXPERIENCES[e1].z_exp - lz) * EXP_CORRECTION;
                EXPERIENCES[e1].x_exp -= (EXPERIENCES[e1].x_exp - lx) * EXP_CORRECTION;
                EXPERIENCES[e1].y_exp -= (EXPERIENCES[e1].y_exp - ly) * EXP_CORRECTION;
                EXPERIENCES[e1].z_exp -= (EXPERIENCES[e1].z_exp - lz) * EXP_CORRECTION;

                // Correct yaw based on facing information
                let TempDeltaYawFacing = getSignedDeltaRadian(EXPERIENCES[e0].yaw_exp_rad + EXPERIENCES[e0].links[link_id].facing_yaw_exp_rad, EXPERIENCES[e1].yaw_exp_rad);
                EXPERIENCES[e0].yaw_exp_rad = clipRadian180(EXPERIENCES[e0].yaw_exp_rad + TempDeltaYawFacing * EXP_CORRECTION);
                EXPERIENCES[e1].yaw_exp_rad = clipRadian180(EXPERIENCES[e1].yaw_exp_rad - TempDeltaYawFacing * EXP_CORRECTION);
            }
        }
    }

    // Maintain history of active experience
    EXP_HISTORY.push(CUR_EXP_ID);
}
