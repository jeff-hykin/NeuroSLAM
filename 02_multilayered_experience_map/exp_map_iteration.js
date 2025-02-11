import { getMinDelta } from "./get_min_delta.js"
import { createNewExp } from "./create_new_exp.js"
import { clipRadian180 } from "./clip_radian_180.js"
import { getSignedDeltaRadian } from "./get_signed_delta_radian.js"

export function expMapIteration({ vtId, transV, yawRotV, heightV, xGc, yGc, zGc, curYawHdc, curHeight, expGlobals }) {
    // used but not modified
    const {
        DELTA_EXP_GC_HDC_THRESHOLD,
        VT,
        PREV_VT_ID,
        GC_X_DIM,
        GC_Y_DIM,
        GC_Z_DIM,
        YAW_HEIGHT_HDC_Y_DIM,
        YAW_HEIGHT_HDC_H_DIM,
        EXP_CORRECTION,
        EXP_LOOPS,
    } = expGlobals

    // modified stuff
    var {
        EXPERIENCES,
        ACCUM_DELTA_YAW,
        ACCUM_DELTA_X,
        ACCUM_DELTA_Y,
        ACCUM_DELTA_Z,
        CUR_EXP_ID,
        PREV_EXP_ID, // NOTE: in the original, for some reason, this was a local var (maybe by accident)
        NUM_EXPS,
        DELTA_EM,
        MIN_DELTA_EM,
        EXP_HISTORY,
    } = expGlobals

    // Update accumulative deltas for position and rotation
    ACCUM_DELTA_YAW = clipRadian180(ACCUM_DELTA_YAW + yawRotV)
    ACCUM_DELTA_X += transV * Math.cos(ACCUM_DELTA_YAW)
    ACCUM_DELTA_Y += transV * Math.sin(ACCUM_DELTA_YAW)
    ACCUM_DELTA_Z += heightV

    // Compute delta for each dimension
    const currentExperience = EXPERIENCES[CUR_EXP_ID]
    let minDeltaX = getMinDelta(currentExperience.x_gc, xGc, GC_X_DIM)
    let minDeltaY = getMinDelta(currentExperience.y_gc, yGc, GC_Y_DIM)
    let minDeltaZ = getMinDelta(currentExperience.z_gc, zGc, GC_Z_DIM)

    let minDeltaYaw = getMinDelta(currentExperience.yaw_hdc, curYawHdc, YAW_HEIGHT_HDC_Y_DIM)
    let minDeltaHeight = getMinDelta(currentExperience.height_hdc, curHeight, YAW_HEIGHT_HDC_H_DIM)

    let minDeltaYawReversed = getMinDelta(currentExperience.yaw_hdc, YAW_HEIGHT_HDC_Y_DIM / 2 - curYawHdc, YAW_HEIGHT_HDC_Y_DIM)
    minDeltaYaw = Math.min(minDeltaYaw, minDeltaYawReversed)

    let deltaEm = Math.sqrt(minDeltaX ** 2 + minDeltaY ** 2 + minDeltaZ ** 2 + minDeltaYaw ** 2 + minDeltaHeight ** 2)
    DELTA_EM.push(deltaEm)

    // Check if new experience should be created
    if (VT[vtId].numExp === 0 || deltaEm > DELTA_EXP_GC_HDC_THRESHOLD) {
        NUM_EXPS++
        createNewExp(CUR_EXP_ID, NUM_EXPS, vtId, xGc, yGc, zGc, curYawHdc, curHeight)
        
        PREV_EXP_ID = CUR_EXP_ID
        CUR_EXP_ID = NUM_EXPS

        ACCUM_DELTA_X = 0
        ACCUM_DELTA_Y = 0
        ACCUM_DELTA_Z = 0
        ACCUM_DELTA_YAW = EXPERIENCES[CUR_EXP_ID].yaw_exp_rad
    } else if (vtId !== PREV_VT_ID) {
        // If VT has changed, search for the matching experience
        let matchedExpId = 0
        let matchedExpCount = 0
        let deltaEmArr = []

        for (let searchId = 0; searchId < VT[vtId].numExp; searchId++) {
            let exp = EXPERIENCES[VT[vtId].EXPERIENCES[searchId].id]

            let minDeltaYaw = getMinDelta(exp.yaw_hdc, curYawHdc, YAW_HEIGHT_HDC_Y_DIM)
            let minDeltaHeight = getMinDelta(exp.height_hdc, curHeight, YAW_HEIGHT_HDC_Y_DIM)

            deltaEmArr[searchId] = Math.sqrt(getMinDelta(exp.x_gc, xGc, GC_X_DIM) ** 2 + getMinDelta(exp.y_gc, yGc, GC_Y_DIM) ** 2 + getMinDelta(exp.z_gc, yGc, GC_Z_DIM) ** 2 + minDeltaYaw ** 2 + minDeltaHeight ** 2)

            if (deltaEmArr[searchId] < DELTA_EXP_GC_HDC_THRESHOLD) {
                matchedExpCount++
            }
        }

        if (matchedExpCount > 1) {
            // Multiple matching experiences - avoid matching due to hash collisions
        } else {
            let [minDelta, minDeltaId] = minDelta(deltaEmArr)
            MIN_DELTA_EM.push(minDelta)
            if (minDelta < DELTA_EXP_GC_HDC_THRESHOLD) {
                matchedExpId = VT[vtId].EXPERIENCES[minDeltaId].id

                // Check if there's already a link between experiences
                let linkExists = false
                for (let linkId = 0; linkId < EXPERIENCES[CUR_EXP_ID].numlinks; linkId++) {
                    if (EXPERIENCES[CUR_EXP_ID].links[linkId].exp_id === matchedExpId) {
                        linkExists = true
                        break
                    }
                }

                if (!linkExists) {
                    // Create a link if it doesn't exist
                    let link = {
                        exp_id: matchedExpId,
                        d_xy: Math.sqrt(ACCUM_DELTA_X ** 2 + ACCUM_DELTA_Y ** 2),
                        d_z: ACCUM_DELTA_Z,
                        heading_yaw_exp_rad: getSignedDeltaRadian(EXPERIENCES[CUR_EXP_ID].yaw_exp_rad, Math.atan2(ACCUM_DELTA_Y, ACCUM_DELTA_X)),
                        facing_yaw_exp_rad: getSignedDeltaRadian(EXPERIENCES[CUR_EXP_ID].yaw_exp_rad, ACCUM_DELTA_YAW),
                    }
                    EXPERIENCES[CUR_EXP_ID].links.push(link)
                    EXPERIENCES[CUR_EXP_ID].numlinks++
                }
            }

            if (matchedExpId === 0) {
                NUM_EXPS++
                createNewExp(CUR_EXP_ID, NUM_EXPS, vtId, xGc, yGc, zGc, curYawHdc, curHeight)
                matchedExpId = NUM_EXPS
            }

            PREV_EXP_ID = CUR_EXP_ID
            CUR_EXP_ID = matchedExpId

            ACCUM_DELTA_X = 0
            ACCUM_DELTA_Y = 0
            ACCUM_DELTA_Z = 0
            ACCUM_DELTA_YAW = EXPERIENCES[CUR_EXP_ID].yaw_exp_rad
        }
    }

    // Perform experience map correction iteratively
    for (let i = 0; i < EXP_LOOPS; i++) {
        for (let expId = 0; expId < NUM_EXPS; expId++) {
            for (let linkId = 0; linkId < EXPERIENCES[expId].numlinks; linkId++) {
                let e0 = expId
                let e1 = EXPERIENCES[expId].links[linkId].exp_id

                // Compute where e0 thinks e1 should be based on link info
                let lx = EXPERIENCES[e0].x_exp + EXPERIENCES[e0].links[linkId].d_xy * Math.cos(EXPERIENCES[e0].yaw_exp_rad + EXPERIENCES[e0].links[linkId].heading_yaw_exp_rad)
                let ly = EXPERIENCES[e0].y_exp + EXPERIENCES[e0].links[linkId].d_xy * Math.sin(EXPERIENCES[e0].yaw_exp_rad + EXPERIENCES[e0].links[linkId].heading_yaw_exp_rad)
                let lz = EXPERIENCES[e0].z_exp + EXPERIENCES[e0].links[linkId].d_z

                // Apply corrections
                EXPERIENCES[e0].x_exp += (EXPERIENCES[e1].x_exp - lx) * EXP_CORRECTION
                EXPERIENCES[e0].y_exp += (EXPERIENCES[e1].y_exp - ly) * EXP_CORRECTION
                EXPERIENCES[e0].z_exp += (EXPERIENCES[e1].z_exp - lz) * EXP_CORRECTION
                EXPERIENCES[e1].x_exp -= (EXPERIENCES[e1].x_exp - lx) * EXP_CORRECTION
                EXPERIENCES[e1].y_exp -= (EXPERIENCES[e1].y_exp - ly) * EXP_CORRECTION
                EXPERIENCES[e1].z_exp -= (EXPERIENCES[e1].z_exp - lz) * EXP_CORRECTION

                // Correct yaw based on facing information
                let TempDeltaYawFacing = getSignedDeltaRadian(EXPERIENCES[e0].yaw_exp_rad + EXPERIENCES[e0].links[linkId].facing_yaw_exp_rad, EXPERIENCES[e1].yaw_exp_rad)
                EXPERIENCES[e0].yaw_exp_rad = clipRadian180(EXPERIENCES[e0].yaw_exp_rad + TempDeltaYawFacing * EXP_CORRECTION)
                EXPERIENCES[e1].yaw_exp_rad = clipRadian180(EXPERIENCES[e1].yaw_exp_rad - TempDeltaYawFacing * EXP_CORRECTION)
            }
        }
    }

    // Maintain history of active experience
    EXP_HISTORY.push(CUR_EXP_ID)
    
    // only return modified stuff
    return {
        EXPERIENCES,
        ACCUM_DELTA_YAW,
        ACCUM_DELTA_X,
        ACCUM_DELTA_Y,
        ACCUM_DELTA_Z,
        CUR_EXP_ID,
        PREV_EXP_ID,
        NUM_EXPS,
        DELTA_EM,
        MIN_DELTA_EM,
        EXP_HISTORY,
    }
}
