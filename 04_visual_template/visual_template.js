import { zip } from "../imports.js"
import { Tensor, Ops } from "../utils/tensor_wrapper.js"
import { arrayOf, crappyRenderAsAsciiGrayscale } from "../utils/misc.js"

import { vtCompareSegments } from "./03_vt_compare_segments.js"

export function visualTemplate(rawImg, x, y, z, yaw, height, vtGlobals) {
    const { 
        NUM_VT, 
        PREV_VT_ID, 
        VT_IMG_CROP_Y_RANGE, 
        VT_IMG_CROP_X_RANGE, 
        VT_IMG_X_SHIFT, 
        VT_IMG_Y_SHIFT, 
        VT_IMG_HALF_OFFSET, 
        VT_MATCH_THRESHOLD, 
        VT_GLOBAL_DECAY, 
        VT_ACTIVE_DECAY, 
        PATCH_SIZE_Y_K, 
        PATCH_SIZE_X_K, 
        VT_IMG_RESIZE_X_RANGE, 
        VT_IMG_RESIZE_Y_RANGE, 
        VT_PANORAMIC,
    } = vtGlobals
    
    var {
        VT, 
        MIN_DIFF_CURR_IMG_VTS, 
        DIFFS_ALL_IMGS_VTS,
        VT_HISTORY,
        VT_HISTORY_FIRST,
        VT_HISTORY_OLD 
    } = vtGlobals

    let vtId
    let SUB_VT_IMG
    let minOffsetY = []
    let minOffsetX = []

    // Resize the raw image with constraint range
    const compensatedRange = [VT_IMG_CROP_Y_RANGE[0], VT_IMG_CROP_Y_RANGE[1]+1]
    let subImg = rawImgTensor.at(compensatedRange.map(each=>each-1), VT_IMG_CROP_X_RANGE.map(each=>each-1))
    // FIXME: VT_IMG_RESIZE_Y_RANGE, VT_IMG_RESIZE_X_RANGE are currently ignored (as to avoid needing to find/make a image resizing function)
    let vtResizedImg = subImg // resizeImage(subImg, VT_IMG_RESIZE_Y_RANGE, VT_IMG_RESIZE_X_RANGE)


    let ySizeVtImg = VT_IMG_RESIZE_Y_RANGE
    let xSizeVtImg = VT_IMG_RESIZE_X_RANGE
    let ySizeNormImg = ySizeVtImg

    // Define a temp variable for patch normalization
    let extVtImg = arrayOf({
        value: 0,
        shape: [
            ySizeVtImg + PATCH_SIZE_Y_K - 1,
            xSizeVtImg + PATCH_SIZE_X_K - 1,
        ]
    })
    for (let v = Math.floor((PATCH_SIZE_Y_K + 1) / 2); v < ySizeNormImg + Math.floor((PATCH_SIZE_Y_K + 1) / 2); v++) {
        for (let u = Math.floor((PATCH_SIZE_X_K + 1) / 2); u < xSizeVtImg + Math.floor((PATCH_SIZE_X_K + 1) / 2); u++) {
            extVtImg[v][u] = vtResizedImg[v - Math.floor((PATCH_SIZE_Y_K + 1) / 2)][u - Math.floor((PATCH_SIZE_X_K + 1) / 2)]
        }
    }

    // Patch normalization loop
    let normVtImg = []
    for (let v = 0; v < ySizeNormImg; v++) {
        normVtImg[v] = []
        for (let u = 0; u < xSizeVtImg; u++) {
            let patchImg = _extractPatch(extVtImg, v, u, PATCH_SIZE_Y_K, PATCH_SIZE_X_K)
            let meanPatchImg = mean2(patchImg)
            let stdPatchImg = std2(patchImg)
            normVtImg[v][u] = (vtResizedImg[v][u] - meanPatchImg) / (stdPatchImg * 255)
        }
    }

    SUB_VT_IMG = normVtImg

    // Processing the first 20 visual templates
    if (NUM_VT < 5) {
        VT[NUM_VT].decay -= VT_GLOBAL_DECAY
        if (VT[NUM_VT].decay < 0) {
            VT[NUM_VT].decay = 0
        }

        NUM_VT++
        VT[NUM_VT] = {
            id: NUM_VT,
            template: normVtImg,
            decay: VT_ACTIVE_DECAY,
            gc_x: x,
            gc_y: y,
            gc_z: z,
            hdc_yaw: yaw,
            hdc_height: height,
            first: 1, // Don't inject energy as the vt is being created
            numExp: 0,
            exps: [],
        }
        vtId = NUM_VT
        VT_HISTORY_FIRST.push(vtId)
    } else {
        for (let k = 1; k < NUM_VT; k++) {
            VT[k].decay -= VT_GLOBAL_DECAY
            if (VT[k].decay < 0) {
                VT[k].decay = 0
            }

            let { offsetY: minOffsetYIter, offsetX: minOffsetXIter, sdif: minDiffIter } = vtCompareSegments({
                seg1: normVtImg, 
                seg2: VT[k].template, 
                vtPanoramic: VT_PANORAMIC, 
                halfOffsetRange: VT_IMG_HALF_OFFSET, 
                slenY: VT_IMG_Y_SHIFT, 
                slenX: VT_IMG_X_SHIFT, 
                cwlY: normVtImg.length, 
                cwlX: normVtImg[0].lengt,
            })
            minOffsetY[k] = minOffsetYIter
            minOffsetX[k] = minOffsetXIter
            MIN_DIFF_CURR_IMG_VTS[k] = minDiffIter
        }

        let minDiff = Math.min(...MIN_DIFF_CURR_IMG_VTS)
        let diffId = MIN_DIFF_CURR_IMG_VTS.indexOf(minDiff)
        DIFFS_ALL_IMGS_VTS.push(minDiff)

        if (minDiff > VT_MATCH_THRESHOLD) {
            NUM_VT++
            VT[NUM_VT] = {
                id: NUM_VT,
                template: normVtImg,
                decay: VT_ACTIVE_DECAY,
                gc_x: x,
                gc_y: y,
                gc_z: z,
                hdc_yaw: yaw,
                hdc_height: height,
                first: 1, // Don't inject energy as the vt is being created
                numExp: 0,
                exps: [],
            }
            vtId = NUM_VT
            VT_HISTORY_FIRST.push(vtId)
        } else {
            vtId = diffId
            VT[vtId].decay += VT_ACTIVE_DECAY
            if (PREV_VT_ID !== vtId) {
                VT[vtId].first = 0
            }
            VT_HISTORY_OLD.push(vtId)
        }
    }

    VT_HISTORY.push(vtId)
    
    return {vtId, VT, MIN_DIFF_CURR_IMG_VTS, DIFFS_ALL_IMGS_VTS, SUB_VT_IMG, VT_HISTORY_FIRST, VT_HISTORY, VT_HISTORY_OLD}
}

function mean2(matrix) {
    let sum = matrix.flat().reduce((a, b) => a + b, 0)
    return sum / matrix.flat().length
}

function std2(matrix) {
    let meanVal = mean2(matrix)
    let squaredDiffs = matrix.flat().map((val) => Math.pow(val - meanVal, 2))
    let meanSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length
    return Math.sqrt(meanSquaredDiff)
}

function _extractPatch(image, v, u, patchHeight, patchWidth) {
    let patch = []
    for (let i = v; i < v + patchHeight; i++) {
        patch.push(image[i].slice(u, u + patchWidth))
    }
    return patch
}