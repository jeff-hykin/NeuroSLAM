// const [curYawTheta, curPitchTheta] = getHdcInitialTheta() // FIXME: uh, the getHdcInitialTheta() (or anything similar) doesnt exist in the matlab...
import { curYawTheta, curPitchTheta, } from './yaw_height_hdc_network/hdc_inital_stuff.js'
import { gcInitial } from '../01_conjunctive_pose_cells_network/3d_grid_cells_network/gc_initial.js'
import { arrayOf } from '../utils/misc.js'

export function vtInitial(imgType, arg, gcInitalInput) {
    const { gcInitialPosition: { gcX, gcY, gcZ } } = gcInital(gcInitalInput)
    // VT structure initialization (1st element)
    return {
        VT: [
            {
                id: 1,
                template: [1],
                decay: 0.7,
                gc_x: gcX,
                gc_y: gcY,
                gc_z: gcZ,
                hdc_yaw: curYawTheta,
                hdc_pitch: curPitchTheta,
                first: 1, // Don't want to inject energy as the VT is being created
                numExp: 1,
                exps: [
                    {
                        id: 1,
                    },
                ],
                template: arrayOf({
                    shape: [ arg.VT_IMG_RESIZE_Y_RANGE, arg.VT_IMG_RESIZE_X_RANGE ],
                    value: 0,
                }),
            }
        ],
        VT_IMG_HALF_OFFSET: [0, Math.floor(arg.VT_IMG_CROP_X_RANGE / 2)],
        NUM_VT,
        PREV_VT_ID,
        VT_HISTORY,
        VT_HISTORY_FIRST,
        VT_HISTORY_OLD,
        MIN_DIFF_CURR_IMG_VTS,
        DIFFS_ALL_IMGS_VTS,
        SUB_VT_IMG,
        IMG_TYPE,
        ...arg,
        // arg should contain:
            // VT_MATCH_THRESHOLD
            // VT_IMG_CROP_Y_RANGE
            // VT_IMG_CROP_X_RANGE
            // VT_IMG_RESIZE_X_RANGE
            // VT_IMG_RESIZE_Y_RANGE
            // VT_IMG_X_SHIFT
            // VT_IMG_Y_SHIFT
            // VT_GLOBAL_DECAY
            // VT_ACTIVE_DECAY
            // PATCH_SIZE_Y_K
            // PATCH_SIZE_X_K
            // BLOCK_READ
    }
}
