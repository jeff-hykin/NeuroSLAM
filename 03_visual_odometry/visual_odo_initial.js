import { Tensor, Ops } from "../utils/tensor_wrapper.js"

export function visualOdoInitial(...args) {
    let odoGlobals = {
        ODO_IMG_TRANS_Y_RANGE: null,
        ODO_IMG_TRANS_X_RANGE: null,
        ODO_IMG_HEIGHT_V_Y_RANGE: null,
        ODO_IMG_HEIGHT_V_X_RANGE: null,
        ODO_IMG_YAW_ROT_Y_RANGE: null,
        ODO_IMG_YAW_ROT_X_RANGE: null,
        ODO_IMG_TRANS_RESIZE_RANGE: null,
        ODO_IMG_YAW_ROT_RESIZE_RANGE: null,
        ODO_IMG_HEIGHT_V_RESIZE_RANGE: null,
        ODO_TRANS_V_SCALE: null,
        ODO_YAW_ROT_V_SCALE: null,
        ODO_HEIGHT_V_SCALE: null,
        MAX_TRANS_V_THRESHOLD: null,
        MAX_YAW_ROT_V_THRESHOLD: null,
        MAX_HEIGHT_V_THRESHOLD: null,
        ODO_SHIFT_MATCH_VERT: null,
        ODO_SHIFT_MATCH_HORI: null,
        FOV_HORI_DEGREE: null,
        FOV_VERT_DEGREE: null,
        KEY_POINT_SET: null,
        ODO_STEP: null,
        PREV_TRANS_V_IMG_X_SUMS: null,
        PREV_YAW_ROT_V_IMG_X_SUMS: null,
        PREV_HEIGHT_V_IMG_Y_SUMS: null,
        PREV_TRANS_V: 0.025, // 0.03 
        PREV_YAW_ROT_V: 0,
        PREV_HEIGHT_V: 0,
        
        // some example values:
            // // ranges are inclusive
            // odoGlobals.ODO_IMG_TRANS_Y_RANGE = Ops.range(1, 270) // 1:270
            // odoGlobals.ODO_IMG_TRANS_X_RANGE = Ops.range(1, 480) // 1:480
            // odoGlobals.ODO_IMG_HEIGHT_V_Y_RANGE = Ops.range(1, 270) // 1:270
            // odoGlobals.ODO_IMG_HEIGHT_V_X_RANGE = Ops.range(1, 480) // 1:480
            // odoGlobals.ODO_IMG_YAW_ROT_Y_RANGE = Ops.range(1, 270) // 1:270
            // odoGlobals.ODO_IMG_YAW_ROT_X_RANGE = Ops.range(1, 480) // 1:480

            // // Convert resize ranges into tensors
            // odoGlobals.ODO_IMG_TRANS_RESIZE_RANGE = new Tensor([130, 240]) // [130, 240]
            // odoGlobals.ODO_IMG_YAW_ROT_RESIZE_RANGE = new Tensor([130, 240]) // [130, 240]
            // odoGlobals.ODO_IMG_HEIGHT_V_RESIZE_RANGE = new Tensor([130, 240]) // [130, 240]

            // // Scalar values
            // odoGlobals.ODO_TRANS_V_SCALE = 30
            // odoGlobals.ODO_YAW_ROT_V_SCALE = 1
            // odoGlobals.ODO_HEIGHT_V_SCALE = 5
            // odoGlobals.MAX_TRANS_V_THRESHOLD = 0.4
            // odoGlobals.MAX_YAW_ROT_V_THRESHOLD = 4.2
            // odoGlobals.MAX_HEIGHT_V_THRESHOLD = 0.4
            // odoGlobals.ODO_SHIFT_MATCH_HORI = 30
            // odoGlobals.ODO_SHIFT_MATCH_VERT = 30
            // odoGlobals.FOV_HORI_DEGREE = 75
            // odoGlobals.FOV_VERT_DEGREE = 20
            // odoGlobals.KEY_POINT_SET = new Tensor([3750, 4700, 8193, 9210]) // [3750, 4700, 8193, 9210]
            // odoGlobals.ODO_STEP = 5

    }
    // Process input parameters
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === "string") {
            switch (args[i]) {
                case "ODO_IMG_TRANS_Y_RANGE":
                    odoGlobals.ODO_IMG_TRANS_Y_RANGE = args[i + 1]
                    break
                case "ODO_IMG_TRANS_X_RANGE":
                    odoGlobals.ODO_IMG_TRANS_X_RANGE = args[i + 1]
                    break
                case "ODO_IMG_HEIGHT_V_Y_RANGE":
                    odoGlobals.ODO_IMG_HEIGHT_V_Y_RANGE = args[i + 1]
                    break
                case "ODO_IMG_HEIGHT_V_X_RANGE":
                    odoGlobals.ODO_IMG_HEIGHT_V_X_RANGE = args[i + 1]
                    break
                case "ODO_IMG_YAW_ROT_Y_RANGE":
                    odoGlobals.ODO_IMG_YAW_ROT_Y_RANGE = args[i + 1]
                    break
                case "ODO_IMG_YAW_ROT_X_RANGE":
                    odoGlobals.ODO_IMG_YAW_ROT_X_RANGE = args[i + 1]
                    break
                case "ODO_IMG_TRANS_RESIZE_RANGE":
                    odoGlobals.ODO_IMG_TRANS_RESIZE_RANGE = args[i + 1]
                    break
                case "ODO_IMG_YAW_ROT_RESIZE_RANGE":
                    odoGlobals.ODO_IMG_YAW_ROT_RESIZE_RANGE = args[i + 1]
                    break
                case "ODO_IMG_HEIGHT_V_RESIZE_RANGE":
                    odoGlobals.ODO_IMG_HEIGHT_V_RESIZE_RANGE = args[i + 1]
                    break
                case "ODO_TRANS_V_SCALE":
                    odoGlobals.ODO_TRANS_V_SCALE = args[i + 1]
                    break
                case "ODO_YAW_ROT_V_SCALE":
                    odoGlobals.ODO_YAW_ROT_V_SCALE = args[i + 1]
                    break
                case "ODO_HEIGHT_V_SCALE":
                    odoGlobals.ODO_HEIGHT_V_SCALE = args[i + 1]
                    break
                case "MAX_TRANS_V_THRESHOLD":
                    odoGlobals.MAX_TRANS_V_THRESHOLD = args[i + 1]
                    break
                case "MAX_YAW_ROT_V_THRESHOLD":
                    odoGlobals.MAX_YAW_ROT_V_THRESHOLD = args[i + 1]
                    break
                case "MAX_HEIGHT_V_THRESHOLD":
                    odoGlobals.MAX_HEIGHT_V_THRESHOLD = args[i + 1]
                    break
                case "ODO_SHIFT_MATCH_HORI":
                    odoGlobals.ODO_SHIFT_MATCH_HORI = args[i + 1]
                    break
                case "ODO_SHIFT_MATCH_VERT":
                    odoGlobals.ODO_SHIFT_MATCH_VERT = args[i + 1]
                    break
                case "FOV_HORI_DEGREE":
                    odoGlobals.FOV_HORI_DEGREE = args[i + 1]
                    break
                case "FOV_VERT_DEGREE":
                    odoGlobals.FOV_VERT_DEGREE = args[i + 1]
                    break
                case "KEY_POINT_SET":
                    odoGlobals.KEY_POINT_SET = args[i + 1]
                    break
                case "ODO_STEP":
                    odoGlobals.ODO_STEP = args[i + 1]
                    break
            }
        }
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

