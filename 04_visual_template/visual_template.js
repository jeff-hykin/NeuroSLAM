import { zip } from "../imports.js"
import { Tensor, Ops } from "../utils/tensor_wrapper.js"
import { arrayOf, crappyRenderAsAsciiGrayscale } from "../utils/misc.js"

import { vtCompareSegments } from "./03_vt_compare_segments.js"

const simpleVisualTemplateThreshold = 5 // hardcoded in the original code
export function visualTemplate(rawImg, x, y, z, yaw, height, vtGlobals) {
    // 
    // init
    // 
        // unmodified global inputs
        const { 
            PREV_VT_ID, 
            VT_IMG_CROP_Y_RANGE, 
            VT_IMG_CROP_X_RANGE, 
            VT_IMG_X_SHIFT, 
            VT_IMG_Y_SHIFT, 
            VT_IMG_HALF_OFFSET, 
            VT_MATCH_THRESHOLD, // the minimum value, below this a specific vt will be replaced 
            VT_GLOBAL_DECAY, 
            VT_ACTIVE_DECAY, 
            PATCH_SIZE_Y_K, 
            PATCH_SIZE_X_K, 
            VT_IMG_RESIZE_X_RANGE, 
            VT_IMG_RESIZE_Y_RANGE, 
            VT_PANORAMIC,
        } = vtGlobals
        
        // mutated (returned) global values
        var {
            NUM_VT,
            VT, 
            MIN_DIFF_CURR_IMG_VTS, 
            DIFFS_ALL_IMGS_VTS,
            VT_HISTORY,
            VT_HISTORY_FIRST,
            VT_HISTORY_OLD 
        } = vtGlobals

        // helper
        function updateDecay(visualTemplateEntry) {
            visualTemplateEntry.decay -= VT_GLOBAL_DECAY
            if (visualTemplateEntry.decay < 0) {
                visualTemplateEntry.decay = 0
            }
        }

        function addVisualTemplate(image) {
            NUM_VT++
            const newTemplate = {
                id: NUM_VT,
                template: image,
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
            VT[newTemplate.id] = newTemplate
            VT_HISTORY_FIRST.push(newTemplate.id)
            return newTemplate.id
        }
    
    // 
    // grab image
    // 
        // Resize the raw image with constraint range
        const compensatedRange = [VT_IMG_CROP_Y_RANGE[0], VT_IMG_CROP_Y_RANGE[1]+1]
        let subImg = rawImgTensor.at(compensatedRange.map(each=>each-1), VT_IMG_CROP_X_RANGE.map(each=>each-1))
        // FIXME: VT_IMG_RESIZE_Y_RANGE, VT_IMG_RESIZE_X_RANGE are currently ignored (as to avoid needing to find/make a image resizing function)
        let vtResizedImg = subImg // resizeImage(subImg, VT_IMG_RESIZE_Y_RANGE, VT_IMG_RESIZE_X_RANGE)
    
    // 
    // calcuate SUB_VT_IMG
    // 
        let SUB_VT_IMG

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

        // Perform patch extension for better normalization
        const patchHeightHalf = Math.floor((PATCH_SIZE_Y_K + 1) / 2)
        const patchWidthHalf = Math.floor((PATCH_SIZE_X_K + 1) / 2)
        // Extend the image boundaries to fit the patch size
        for (let v = patchHeightHalf; v < ySizeNormImg + patchHeightHalf; v++) {
            for (let u = patchWidthHalf; u < xSizeVtImg + patchWidthHalf; u++) {
                extVtImg[v][u] = vtResizedImg[v - patchHeightHalf][u - patchWidthHalf]
            }
        }

        // Normalize the image patches by subtracting the mean and dividing by the standard deviation
        let normVtImg = []
        for (let v = 0; v < ySizeNormImg; v++) {
            normVtImg[v] = []
            for (let u = 0; u < xSizeVtImg; u++) {
                // Extract the patch from the extended image
                let patchImg = _extractPatch(extVtImg, v, u, PATCH_SIZE_Y_K, PATCH_SIZE_X_K)
                let meanPatchImg = mean2(patchImg)
                let stdPatchImg = std2(patchImg)
                // Normalize the pixel value for the current position (v, u)
                normVtImg[v][u] = (vtResizedImg[v][u] - meanPatchImg) / (stdPatchImg * 255)
            }
        }

        // update: SUB_VT_IMG
        SUB_VT_IMG = normVtImg
    
    // 
    // create a new template if the number of templates is really small
    // 
    let vtId
    if (NUM_VT < simpleVisualTemplateThreshold) {
        let nearestTemplate = VT[NUM_VT]
        updateDecay(nearestTemplate)
        
        // Add new template, record the id
        vtId = addVisualTemplate(normVtImg)
    // 
    // check if an existing vt needs replacing, or if we should add a vt
    // 
    } else {
        // 
        // update decays for all templates
        // 
            const templatesMinusFirst = VT.slice(1)
            for (var eachTemplate of templatesMinusFirst) {
                updateDecay(eachTemplate)
            }
        
        // 
        // compute score for each template
        // 
            let minOffsetY = []
            let minOffsetX = []
            let k = 0//NOTE: this is effectively starting at i=1 (the second element) because of templatesMinusFirst
            for (var eachTemplate of templatesMinusFirst) {
                k++
                // Compare the current image with each template in the history
                let { offsetY: minOffsetYIter, offsetX: minOffsetXIter, sdif: minDiffIter } = vtCompareSegments({
                    seg1: normVtImg, 
                    seg2: eachTemplate.template, 
                    vtPanoramic: VT_PANORAMIC, 
                    halfOffsetRange: VT_IMG_HALF_OFFSET, 
                    slenY: VT_IMG_Y_SHIFT, 
                    slenX: VT_IMG_X_SHIFT, 
                    cwlY: normVtImg.length, 
                    cwlX: normVtImg[0].length,
                })

                // Store the computed offsets and minimum difference for this comparison
                minOffsetY[k] = minOffsetYIter
                minOffsetX[k] = minOffsetXIter
                MIN_DIFF_CURR_IMG_VTS[k] = minDiffIter
            }

            // Find the template with the smallest difference
            let minDiff = Math.min(...MIN_DIFF_CURR_IMG_VTS)
            let idOfVtWithMinDiff = MIN_DIFF_CURR_IMG_VTS.indexOf(minDiff)
            DIFFS_ALL_IMGS_VTS.push(minDiff)
        
        // 
        // decide: either replace or add a vt
        // 
            if (minDiff > VT_MATCH_THRESHOLD) {
                vtId = addVisualTemplate(normVtImg)
            } else {
                const vtWithMinDiff = VT[idOfVtWithMinDiff]
                
                // NOTE: this is different than updateDecay()
                //       I'm not sure why its different --Jeff
                vtWithMinDiff.decay += VT_ACTIVE_DECAY
                // TODO: I don't understand this check, but it seems important
                if (PREV_VT_ID !== idOfVtWithMinDiff) {
                    vtWithMinDiff.first = 0 // Flag indicating that energy can be injected
                }
                vtId = idOfVtWithMinDiff
                VT_HISTORY_OLD.push(vtId)
            }
        // 
    }

    // Record the updated template history
    VT_HISTORY.push(vtId)
    
    // Return all the updated state variables
    return {
        vtId,
        VT,
        NUM_VT,
        MIN_DIFF_CURR_IMG_VTS, // seems to only be used for display/debugging
        DIFFS_ALL_IMGS_VTS,
        SUB_VT_IMG,
        VT_HISTORY_FIRST,
        VT_HISTORY,
        VT_HISTORY_OLD,
    }
}

// calculates the mean of a 2D array
function mean2(matrix) {
    let sum = matrix.flat().reduce((a, b) => a + b, 0)
    return sum / matrix.flat().length
}

// calculate the standard deviation of a 2D array
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