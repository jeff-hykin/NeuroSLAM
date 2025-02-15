#!/usr/bin/env -S deno run --allow-all
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.72/main/file_system.js"
import { Tensor, Ops } from "../../../utils/tensor_wrapper_torch.js"

import { visualOdoInitial } from "../../../03_visual_odometry/00_visual_odo_initial.js"
import { visualOdoMain } from "../../../03_visual_odometry/01_visual_odo_main.js"

const projectPath = `${FileSystem.thisFolder}/../../../`;

await visualOdoMain({
    visualDataFile: `${projectPath}/01_NeuroSLAM_Datasets.ignore/`, 
    // visualDataFile: `${projectPath}/01_NeuroSLAM_Datasets.ignore/02_SynPanData/`, 
    groundTruthPath: `${projectPath}/02_NeuroSLAM_Groudtruth.ignore/02_SynPanData_GT.txt`,
    odoGlobals: visualOdoInitial({
        ODO_IMG_TRANS_Y_RANGE: [51, 150], // note: in matlab these are proper ranges, not an array with two elements
        ODO_IMG_TRANS_X_RANGE: [181, 300], // note: in matlab these are proper ranges, not an array with two elements
        ODO_IMG_HEIGHT_V_Y_RANGE: [51, 150], // note: in matlab these are proper ranges, not an array with two elements
        ODO_IMG_HEIGHT_V_X_RANGE: [180, 300], // note: in matlab these are proper ranges, not an array with two elements
        ODO_IMG_YAW_ROT_Y_RANGE: [51, 150], // note: in matlab these are proper ranges, not an array with two elements
        ODO_IMG_YAW_ROT_X_RANGE: [180, 300], // note: in matlab these are proper ranges, not an array with two elements
        
        ODO_IMG_TRANS_RESIZE_RANGE: [100, 120], 
        ODO_IMG_YAW_ROT_RESIZE_RANGE: [100, 120], 
        ODO_IMG_HEIGHT_V_RESIZE_RANGE: [100, 120], 
        ODO_TRANS_V_SCALE: 1, 
        ODO_YAW_ROT_V_SCALE: 1, 
        ODO_HEIGHT_V_SCALE: 1, 
        MAX_TRANS_V_THRESHOLD: 0.02, 
        MAX_YAW_ROT_V_THRESHOLD: 10, 
        MAX_HEIGHT_V_THRESHOLD: 0.03,  
        ODO_SHIFT_MATCH_HORI: 36, 
        ODO_SHIFT_MATCH_VERT: 20, 
        FOV_HORI_DEGREE: 90, 
        FOV_VERT_DEGREE: 50, 
        KEY_POINT_SET: [1644, 1741], 
        ODO_STEP: 1
    }),
})
console.log(`done`)