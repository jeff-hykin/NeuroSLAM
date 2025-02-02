// Assuming js-pytorch and other necessary functions are available
import { torch } from "../imports.js"

export function visualOdometry(rawImg, odoGlobals) {
    const {
        ODO_IMG_TRANS_Y_RANGE,
        ODO_IMG_TRANS_X_RANGE,
        ODO_IMG_HEIGHT_V_Y_RANGE,
        ODO_IMG_HEIGHT_V_X_RANGE,
        ODO_IMG_YAW_ROT_Y_RANGE,
        ODO_IMG_YAW_ROT_X_RANGE,
        ODO_IMG_TRANS_RESIZE_RANGE,
        ODO_IMG_YAW_ROT_RESIZE_RANGE,
        ODO_IMG_HEIGHT_V_RESIZE_RANGE,
        ODO_TRANS_V_SCALE,
        ODO_YAW_ROT_V_SCALE,
        ODO_HEIGHT_V_SCALE,
        MAX_TRANS_V_THRESHOLD,
        MAX_YAW_ROT_V_THRESHOLD,
        MAX_HEIGHT_V_THRESHOLD,
        ODO_SHIFT_MATCH_VERT,
        ODO_SHIFT_MATCH_HORI,
        FOV_HORI_DEGREE,
        FOV_VERT_DEGREE,
        KEY_POINT_SET,
        ODO_STEP,
        PREV_TRANS_V_IMG_X_SUMS,
        PREV_YAW_ROT_V_IMG_X_SUMS,
        PREV_HEIGHT_V_IMG_Y_SUMS,
        PREV_TRANS_V,
        PREV_YAW_ROT_V,
        PREV_HEIGHT_V,
    } = odoGlobals

    let sideEffects

    // Step 1: Compute horizontal rotational velocity (yaw)
    let subRawImg = rawImg.slice(ODO_IMG_YAW_ROT_Y_RANGE[0], ODO_IMG_YAW_ROT_Y_RANGE[1], ODO_IMG_YAW_ROT_X_RANGE[0], ODO_IMG_YAW_ROT_X_RANGE[1])
    subRawImg = Image.resize(subRawImg, ODO_IMG_YAW_ROT_RESIZE_RANGE)
    let horiDegPerPixel = FOV_HORI_DEGREE / subRawImg[1].length

    sideEffects.SUB_YAW_ROT_IMG = subRawImg
    sideEffects.SUB_TRANS_IMG = subRawImg

    // Step 2: Compute intensity sum across columns (x-sums)
    let imgXSums = subRawImg.reduce((acc, row) => acc.map((sum, i) => sum + row[i]), Array(subRawImg[0].length).fill(0))
    let avgIntensity = imgXSums.reduce((sum, val) => sum + val, 0) / imgXSums.length
    imgXSums = imgXSums.map((x) => x / avgIntensity)

    // Step 3: Compare the current image with the previous image
    let { outMinimumOffset: minOffsetYawRot, outMinimumDifferenceIntensity: minDiffIntensityRot } = compareSegments(imgXSums, PREV_YAW_ROT_V_IMG_X_SUMS, ODO_SHIFT_MATCH_HORI, imgXSums.length)

    sideEffects.OFFSET_YAW_ROT = minOffsetYawRot
    let yawRotV = ODO_YAW_ROT_V_SCALE * minOffsetYawRot * horiDegPerPixel // in degrees

    if (Math.abs(yawRotV) > MAX_YAW_ROT_V_THRESHOLD) {
        yawRotV = PREV_YAW_ROT_V
    } else {
        sideEffects.PREV_YAW_ROT_V = yawRotV
    }

    sideEffects.PREV_YAW_ROT_V_IMG_X_SUMS = imgXSums
    sideEffects.PREV_TRANS_V_IMG_X_SUMS = imgXSums

    // Step 4: Compute total translational velocity
    let transV = minDiffIntensityRot * ODO_TRANS_V_SCALE

    if (transV > MAX_TRANS_V_THRESHOLD) {
        transV = PREV_TRANS_V
    } else {
        sideEffects.PREV_TRANS_V = transV
    }

    // Step 5: Compute height change velocity (vertical velocity)
    subRawImg = rawImg.slice(ODO_IMG_HEIGHT_V_Y_RANGE[0], ODO_IMG_HEIGHT_V_Y_RANGE[1], ODO_IMG_HEIGHT_V_X_RANGE[0], ODO_IMG_HEIGHT_V_X_RANGE[1])
    subRawImg = Image.resize(subRawImg, ODO_IMG_HEIGHT_V_RESIZE_RANGE)
    let vertDegPerPixel = FOV_VERT_DEGREE / subRawImg.length

    // Adjust image based on yaw offset
    if (minOffsetYawRot > 0) {
        subRawImg = subRawImg.map((row) => row.slice(minOffsetYawRot))
    } else {
        subRawImg = subRawImg.map((row) => row.slice(0, row.length - Math.abs(minOffsetYawRot)))
    }

    sideEffects.SUB_HEIGHT_V_IMG = subRawImg

    // Compute y-sums (sum of intensities along each row)
    let imageYSums = subRawImg.reduce((acc, row) => acc.map((sum, i) => sum + row[i]), Array(subRawImg.length).fill(0))
    let avgIntensityHeight = imageYSums.reduce((sum, val) => sum + val, 0) / imageYSums.length
    imageYSums = imageYSums.map((y) => y / avgIntensityHeight)

    let { outMinimumOffset: minOffsetHeightV, outMinimumDifferenceIntensity: minDiffIntensityHeight } = compareSegments(imageYSums, PREV_HEIGHT_V_IMG_Y_SUMS, ODO_SHIFT_MATCH_VERT, imageYSums.length)

    if (minOffsetHeightV < 0) {
        minDiffIntensityHeight = -minDiffIntensityHeight
    }

    sideEffects.OFFSET_HEIGHT_V = minOffsetHeightV

    let heightV = 0
    // there's a lot of commented out code in the original around this area
    // if (minOffsetHeightV > 3) {
    //     heightV = ODO_HEIGHT_V_SCALE * minDiffIntensityHeight
    // }

    if (Math.abs(heightV) > MAX_HEIGHT_V_THRESHOLD) {
        heightV = PREV_HEIGHT_V
    } else {
        sideEffects.PREV_HEIGHT_V = heightV
    }

    sideEffects.PREV_HEIGHT_V_IMG_Y_SUMS = imageYSums

    // Return the results
    return { transV, yawRotV, heightV, sideEffects }
}

// // Example usage
// let rawImg = [
//     /* raw image data (e.g., a 2D array of intensity values) */
// ]
// let result = visualOdometry(rawImg)
// console.log(result)
