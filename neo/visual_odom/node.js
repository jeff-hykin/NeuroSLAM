import { Event, trigger, everyTime, everyTimeAllLatestOf, once } from "../../utils/event_manager.js"
import { Tensor, Ops } from "../../utils/tensor_wrapper_torch.js"
import { parseCsv } from "../../imports.js"
import { pathPureName } from "../../imports.js"
import { VisualOdom } from "./VisualOdom.js"
import { newVisualOdomEvent } from "./event.js"

// input events
import { newGrayscaleImageEvent } from "../grayscale_image/event.js"

const visualOdomObject = new VisualOdom({
    ODO_IMG_TRANS_Y_RANGE: [51, 150],
    ODO_IMG_TRANS_X_RANGE: [181, 300],
    ODO_IMG_HEIGHT_V_Y_RANGE: [51, 150],
    ODO_IMG_HEIGHT_V_X_RANGE: [180, 300],
    ODO_IMG_YAW_ROT_Y_RANGE: [51, 150],
    ODO_IMG_YAW_ROT_X_RANGE: [180, 300],
    
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
})

everyTime(newGrayscaleImageEvent).then(({frame, frameRealIndex, ...other})=>{
    const { transV, yawRotV, heightV, } = visualOdomObject.next(frame)
    trigger(newVisualOdomEvent, {
        transV, yawRotV, heightV, frameRealIndex,
    })
})