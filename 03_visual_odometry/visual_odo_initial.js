import { Tensor, Ops } from "../utils/tensor_wrapper.js"

export function visualOdoInitial(initGlobals, ...args) {
    let odoGlobals = {
        // see 07_test/test_aidvo/SynPanData/test_vo_ov_SynPanData.js for example inputs
        ...initGlobals,
    }

    // Initialize the previous image intensity sums
    odoGlobals.PREV_YAW_ROT_V_IMG_X_SUMS = new Tensor( new Array(odoGlobals.ODO_IMG_TRANS_RESIZE_RANGE[1]).fill(0) )
    odoGlobals.PREV_HEIGHT_V_IMG_Y_SUMS = new Tensor( new Array(odoGlobals.ODO_IMG_HEIGHT_V_RESIZE_RANGE[0]).fill(0) )
    odoGlobals.PREV_TRANS_V_IMG_X_SUMS = new Tensor( new Array(odoGlobals.ODO_IMG_TRANS_RESIZE_RANGE[1] - odoGlobals.ODO_SHIFT_MATCH_HORI).fill(0) )

    // Initialize the previous velocities
    odoGlobals.PREV_TRANS_V = 0.025
    odoGlobals.PREV_YAW_ROT_V = 0
    odoGlobals.PREV_HEIGHT_V = 0

    return odoGlobals
}

