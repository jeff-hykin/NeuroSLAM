import { Event, trigger, everyTime, everyTimeAllLatestOf, once } from "../../utils/event_manager.js"
import { Tensor, Ops } from "../utils/tensor_wrapper_torch.js"
import { parseCsv, zip } from "../../imports.js"
import { pathPureName } from "../../imports.js"

// Define the constants
const DEGREE_TO_RADIAN = Math.PI / 180
const RADIAN_TO_DEGREE = 180 / Math.PI

// helper
function compareSegments({seg1, seg2, shiftLength, compareLengthOfIntensity}) {
    // Initialize the minimum difference to a large value
    let minimumDifferenceIntensity = 1e6
    let minimumOffset = 0

    // Initialize the differences array to store results
    let differences = Array(shiftLength).fill(0)

    // Convert the segments into torch tensors (assuming they are 1D arrays)
    const tensorSeg1 = new Tensor(seg1)
    const tensorSeg2 = new Tensor(seg2)

    // Loop through positive shifts
    for (let offset = 0; offset <= shiftLength; offset++) {
        // starts at 120, goes down in steps of 1, ends at 84
        // tensorSeg1.at([offset, compareLengthOfIntensity]).shape
        // tensorSeg2.at([0, (compareLengthOfIntensity-offset)]) // all zeros, seemingly on each iteration of this for loop

        // Slice the tensors and compute the absolute difference
        let compareDifferenceSegments = Ops.abs(
            tensorSeg1.at({start:offset, end:compareLengthOfIntensity}).subtract(
                tensorSeg2.at({start: 0, end:(compareLengthOfIntensity-offset)})
            )
        )
        // console.log(compareDifferenceSegments.data.map(each=>each.toFixed(4)).join(" "))
            // this=  1.1234 0.9719 0.9701 0.9946 1.1007 0.9594 0.9770 0.9845 0.9829 0.9940 0.9866 0.9843 0.9682 0.9935 1.0111 1.0308 0.9939 0.9918 1.0189 1.0220 0.9620 1.0907 1.1867 1.2334 1.2983 1.2735 1.2024 1.1461 1.0518 1.0518 0.9929 1.2064 1.2058 1.1782 1.1508 1.1482 1.1694 1.1450 0.9518 0.9021 0.8843 1.0234 1.0466 1.0192 1.0079 1.0214 1.0015 1.0078 1.0018 1.0085 0.9932 0.9691 0.9732 0.9535 0.9454 0.9141 0.9194 0.9238 0.8390 0.7903 0.7883 0.7668 0.7475 0.7296 0.7122 0.6736 0.6681 0.7434 0.7281 0.6923 0.6724 0.6767 0.6656 0.6470 0.6485 0.6964 0.6653 0.6788 0.7093 0.6920 0.6741 0.6541 0.6550 0.6325
            // matlab=1.0798 0.9623 0.9759 1.0361 1.0680 0.9570 0.9836 0.9869 0.9898 0.9952 0.9889 0.9798 0.9788 1.0042 1.0252 1.0200 0.9918 1.0061 1.0286 0.9903 1.0149 1.1452 1.2151 1.2738 1.2982 1.2426 1.1781 1.0954 1.0533 1.0074 1.1139 1.2234 1.1950 1.1639 1.1497 1.1664 1.1726 1.0273 0.9147 0.8806 0.9775 1.0501 1.0326 1.0122 1.0215 1.0102 1.0088 1.0061 1.0107 1.0019 0.9769 0.9759 0.9614 0.9515 0.9226 0.9201 0.9315 0.8598 0.7993 0.7914 0.7735 0.7532 0.7349 0.7184 0.6804 0.6663 0.7382 0.7342 0.6984 0.6756 0.6786 0.6691 0.6500 0.6486 0.6968 0.6685 0.6794 0.7107 0.6950 0.6767 0.6564 0.6570 0.6345 0.6468

        // Sum the differences and normalize
        let sumCompareDifferenceSegments = compareDifferenceSegments.sum() / (compareLengthOfIntensity - offset)
        differences[shiftLength - offset] = sumCompareDifferenceSegments

        // Update the minimum difference and offset
        if (sumCompareDifferenceSegments < minimumDifferenceIntensity) {
            minimumDifferenceIntensity = sumCompareDifferenceSegments
            minimumOffset = offset
        }
    }

    // Loop through negative shifts
    for (let offset = 1; offset <= shiftLength; offset++) {
        // Slice the tensors and compute the absolute difference
        let compareDifferenceSegments = Ops.abs(tensorSeg1.slice(0, compareLengthOfIntensity - offset).subtract(tensorSeg2.slice(offset, compareLengthOfIntensity)))

        // Sum the differences and normalize
        let sumCompareDifferenceSegments = compareDifferenceSegments.sum() / (compareLengthOfIntensity - offset)
        differences[shiftLength + offset] = sumCompareDifferenceSegments

        // Update the minimum difference and offset
        if (sumCompareDifferenceSegments < minimumDifferenceIntensity) {
            minimumDifferenceIntensity = sumCompareDifferenceSegments
            minimumOffset = -offset
        }
    }
    // Return the minimum offset and minimum difference intensity
    return { minimumOffset, minimumDifferenceIntensity }
}

export function visualOdometryStep(rawImg, {
        ODO_IMG_HEIGHT_V_Y_RANGE,
        ODO_IMG_HEIGHT_V_X_RANGE,
        ODO_IMG_YAW_ROT_Y_RANGE,
        ODO_IMG_YAW_ROT_X_RANGE,
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
    }) {
    
    // ones listed here are inputs and mutated
    let sideEffects = {
        PREV_HEIGHT_V_IMG_Y_SUMS: PREV_HEIGHT_V_IMG_Y_SUMS,
        PREV_TRANS_V: PREV_TRANS_V,
        PREV_YAW_ROT_V: PREV_YAW_ROT_V,
        PREV_HEIGHT_V: PREV_HEIGHT_V,
    }
    
    // DEBUGGING: compare to matlab referfence values
        // let slice = new Tensor(rawImg).at({start:0, end:10}, {start:0, end:8})
        // 
        // const referenceValues = (new Tensor([
        //     [0.4501, 0.4501, 0.4500, 0.4503, 0.4496, 0.4503, 0.4499, 0.4499],
        //     [0.4526, 0.4525, 0.4526, 0.4525, 0.4524, 0.4523, 0.4522, 0.4522],
        //     [0.4544, 0.4544, 0.4543, 0.4542, 0.4540, 0.4539, 0.4538, 0.4537],
        //     [0.4563, 0.4561, 0.4559, 0.4557, 0.4555, 0.4554, 0.4551, 0.4550],
        //     [0.4578, 0.4575, 0.4573, 0.4570, 0.4567, 0.4565, 0.4562, 0.4559],
        //     [0.4591, 0.4588, 0.4584, 0.4581, 0.4577, 0.4575, 0.4571, 0.4567],
        //     [0.4602, 0.4598, 0.4594, 0.4590, 0.4587, 0.4581, 0.4577, 0.4574],
        //     [0.4609, 0.4605, 0.4600, 0.4595, 0.4591, 0.4586, 0.4581, 0.4576],
        //     [0.4615, 0.4609, 0.4604, 0.4599, 0.4593, 0.4588, 0.4582, 0.4577],
        //     [0.4617, 0.4610, 0.4605, 0.4600, 0.4593, 0.4588, 0.4581, 0.4576],
        // ]))
        // const diff = slice.subtract(referenceValues)
        // let max = Math.max(...diff.data.flat(Infinity))
        // let min = Math.min(...diff.data.flat(Infinity))
        // console.debug(`max is:`,max) // max is: 0.000003303578240632099
        // console.debug(`min is:`,min) // min is: -0.00010305180437936157
        // for (let each of diff.data) {
        //     console.debug(each.join(" "))
        // }
        // console.log(``)
        // for (let [thisOne, reference, eachDiff ] of zip(slice.data, referenceValues.data, diff.data)) {
        //     let otherDiffs = zip(thisOne, reference,).map(([thisCell, referenceCell]) => thisCell - referenceCell)
        //     console.debug("    ",reference.join(" "))
        //     console.debug("    ",thisOne.join(" "))
        //     console.debug("    ",eachDiff.join(" "))
        //     console.debug("    ",otherDiffs.join(" "))
        //     console.log(``)
        // }
    // Step 1: Compute horizontal rotational velocity (yaw)
    // console.debug(`rawImg.height is:`,rawImg.height)
    // console.debug(`rawImg.width is:`,rawImg.width)
    // console.debug(`rawImg is:`,rawImg.length)
    // console.debug(`rawImg is:`,rawImg[0].length)
    // console.debug(`ODO_IMG_YAW_ROT_Y_RANGE is:`,ODO_IMG_YAW_ROT_Y_RANGE)
    // console.debug(`ODO_IMG_YAW_ROT_X_RANGE is:`,ODO_IMG_YAW_ROT_X_RANGE)
    // console.debug(`ODO_IMG_YAW_ROT_RESIZE_RANGE is:`,ODO_IMG_YAW_ROT_RESIZE_RANGE)
    let rawImgTensor = new Tensor(rawImg)
        // let referenceImgTensor = new Tensor([
        //     [0.4501,0.4501,0.4500,0.4503,0.4496,0.4503,0.4499,0.4499, 0.4502,0.4499],
        //     [0.4526,0.4525,0.4526,0.4525,0.4524,0.4523,0.4522,0.4522, 0.4521,0.4520],
        //     [0.4544,0.4544,0.4543,0.4542,0.4540,0.4539,0.4538,0.4537, 0.4535,0.4533],
        //     [0.4563,0.4561,0.4559,0.4557,0.4555,0.4554,0.4551,0.4550, 0.4547,0.4546],
        //     [0.4578,0.4575,0.4573,0.4570,0.4567,0.4565,0.4562,0.4559, 0.4557,0.4555],
        //     [0.4591,0.4588,0.4584,0.4581,0.4577,0.4575,0.4571,0.4567, 0.4564,0.4562],
        //     [0.4602,0.4598,0.4594,0.4590,0.4587,0.4581,0.4577,0.4574, 0.4570,0.4566],
        //     [0.4609,0.4605,0.4600,0.4595,0.4591,0.4586,0.4581,0.4576, 0.4573,0.4568],
        //     [0.4615,0.4609,0.4604,0.4599,0.4593,0.4588,0.4582,0.4577, 0.4573,0.4568],
        //     [0.4617,0.4610,0.4605,0.4600,0.4593,0.4588,0.4581,0.4576, 0.4571,0.4565],
        // ])
        // console.debug(`rawImgTensor is:`,)
        // let referenceImgTensor2 = new Tensor([
        //     [0.5341, 0.5447, 0.5056, 0.5112, 0.5736, 0.5295, 0.4979, 0.5151, 0.2443, 0.1979, 0.2119],
        //     [0.5022, 0.5293, 0.5816, 0.5005, 0.5484, 0.5466, 0.5598, 0.5151, 0.2544, 0.2899, 0.2258],
        //     [0.5613, 0.5454, 0.5719, 0.5189, 0.5640, 0.5407, 0.5505, 0.4798, 0.2709, 0.2454, 0.2971],
        //     [0.5424, 0.5053, 0.5082, 0.5562, 0.5505, 0.5162, 0.4622, 0.5068, 0.2747, 0.2860, 0.3564],
        //     [0.4876, 0.4909, 0.5466, 0.5549, 0.5736, 0.5362, 0.5872, 0.5220, 0.4432, 0.3282, 0.3692],
        //     [0.4991, 0.5448, 0.5492, 0.5860, 0.6044, 0.5380, 0.5608, 0.5112, 0.4811, 0.4489, 0.4923],
        //     [0.5801, 0.5666, 0.5262, 0.5491, 0.5562, 0.5640, 0.5212, 0.4464, 0.3617, 0.3605, 0.3289],
        //     [0.5156, 0.5561, 0.5814, 0.5536, 0.5582, 0.5353, 0.5597, 0.4701, 0.2103, 0.2241, 0.3339],
        //     [0.5657, 0.5713, 0.5041, 0.6145, 0.5378, 0.5603, 0.5767, 0.5229, 0.2292, 0.1805, 0.1505],
        //     [0.5580, 0.5623, 0.5067, 0.5547, 0.4954, 0.5216, 0.5699, 0.4755, 0.2601, 0.2532, 0.3270],
        //     [0.5677, 0.5497, 0.5425, 0.5384, 0.5293, 0.5798, 0.5445, 0.5052, 0.2935, 0.2496, 0.2546],
        // ])
        // crappyRenderAsAsciiGrayscale(rawImgTensor.at([51,61], [180,190]))
        // // console.debug(`referenceImgTensor is:`,)
        // // crappyRenderAsAsciiGrayscale(referenceImgTensor.at([0,10], [0,10]))
        // console.debug(`referenceImgTensor2 is:`,)
        // crappyRenderAsAsciiGrayscale(referenceImgTensor2)
        // // crappyRenderAsAsciiGrayscale(referenceImgTensor2.at([0,10], [0,10]))
    
    // note there was what I think was an off by one error in the original codebase thats was compensated for by an image resize right after the slice
    // however, here I simply compensate by adding one to the input of ODO_IMG_YAW_ROT_Y_RANGE
    let subRawImg = rawImgTensor.at(
        {start:ODO_IMG_YAW_ROT_Y_RANGE[0]-1, end:ODO_IMG_YAW_ROT_Y_RANGE[1]}, // NOTE: there is an intenionally-missing -1 here
        {start:ODO_IMG_YAW_ROT_X_RANGE[0]-1, end:ODO_IMG_YAW_ROT_X_RANGE[1]-1}
    )
        // const subRawImgCompare = new Tensor(subRawImg).at([0,10], [0,8])
        // const subRawImgReference = new Tensor([
        //     [0.5342, 0.5443, 0.5054, 0.5125, 0.5734, 0.5278, 0.4985, 0.5045],
        //     [0.5024, 0.5299, 0.5806, 0.5007, 0.5490, 0.5471, 0.5591, 0.5031],
        //     [0.5612, 0.5457, 0.5712, 0.5193, 0.5640, 0.5408, 0.5486, 0.4696],
        //     [0.5421, 0.5052, 0.5090, 0.5566, 0.5497, 0.5139, 0.4632, 0.4982],
        //     [0.4876, 0.4915, 0.5471, 0.5554, 0.5729, 0.5373, 0.5861, 0.5175],
        //     [0.4993, 0.5449, 0.5498, 0.5868, 0.6029, 0.5376, 0.5596, 0.5089],
        //     [0.5799, 0.5662, 0.5263, 0.5495, 0.5565, 0.5630, 0.5179, 0.4412],
        //     [0.5159, 0.5565, 0.5812, 0.5534, 0.5576, 0.5358, 0.5576, 0.4572],
        //     [0.5658, 0.5705, 0.5055, 0.6141, 0.5373, 0.5612, 0.5758, 0.5096],
        //     [0.5580, 0.5617, 0.5071, 0.5539, 0.4952, 0.5237, 0.5680, 0.4644],
        // ])
        // console.debug(`subRawImgCompare is:`,)
        // crappyRenderAsAsciiGrayscale(subRawImgCompare)
        // console.debug(`subRawImgReference is:`,)
        // crappyRenderAsAsciiGrayscale(subRawImgReference)
        // console.debug(`subRawImgCompare.subtract(subRawImgReference) is:`,crappyRenderAsAsciiGrayscale(subRawImgCompare.subtract(subRawImgReference)))
    // console.debug(`subRawImg is:`,subRawImg.length)
    // console.debug(`subRawImg is:`,subRawImg[0].length)
    // subRawImg = Image.resize(subRawImg, ODO_IMG_YAW_ROT_RESIZE_RANGE)
    let horiDegPerPixel = FOV_HORI_DEGREE / subRawImg.at(1).length

    sideEffects.SUB_YAW_ROT_IMG = subRawImg
    sideEffects.SUB_TRANS_IMG = subRawImg

    // Step 2: Compute intensity sum across columns (x-sums)
    let avgIntensity = subRawImg.sum() / subRawImg.shape[1]
    let imgXSums = subRawImg.sum(0).div(avgIntensity)
    // console.debug(`subRawImg.sum(0).data.join(" ") is:`,subRawImg.sum(0).data.map(each=>each.toFixed(3)).join(" "))
    // console.debug(`imgXSums.data.join(" ") is:`,imgXSums.data.map(each=>each.toFixed(3)).join(" "))
    

    // Step 3: Compare the current image with the previous image
    let { minimumOffset: minOffsetYawRot, minimumDifferenceIntensity: minDiffIntensityRot } = compareSegments({
        seg1: imgXSums,
        seg2: PREV_YAW_ROT_V_IMG_X_SUMS,
        shiftLength: ODO_SHIFT_MATCH_HORI,
        compareLengthOfIntensity: imgXSums.length,
    })
    
    // console.debug(`minOffsetYawRot is:`,minOffsetYawRot)
    // console.debug(`minDiffIntensityRot is:`,minDiffIntensityRot)

    sideEffects.OFFSET_YAW_ROT = minOffsetYawRot
    let yawRotV = ODO_YAW_ROT_V_SCALE * minOffsetYawRot * horiDegPerPixel // in degrees

    if (Math.abs(yawRotV) > MAX_YAW_ROT_V_THRESHOLD) {
        yawRotV = sideEffects.PREV_YAW_ROT_V
    } else {
        sideEffects.PREV_YAW_ROT_V = yawRotV
    }

    sideEffects.PREV_YAW_ROT_V_IMG_X_SUMS = imgXSums
    sideEffects.PREV_TRANS_V_IMG_X_SUMS = imgXSums

    // Step 4: Compute total translational velocity
    let transV = minDiffIntensityRot * ODO_TRANS_V_SCALE
    
    if (sideEffects.PREV_TRANS_V == null) {
        sideEffects.PREV_TRANS_V = transV
    }
    if (transV > MAX_TRANS_V_THRESHOLD) {
        transV = sideEffects.PREV_TRANS_V
    } else {
        sideEffects.PREV_TRANS_V = transV
    }

    // Step 5: Compute height change velocity (vertical velocity)
    subRawImg = rawImgTensor.at(
        {start:ODO_IMG_HEIGHT_V_Y_RANGE[0]-1, end:ODO_IMG_HEIGHT_V_Y_RANGE[1]}, // NOTE: there is an intenionally-missing -1 here
        {start:ODO_IMG_HEIGHT_V_X_RANGE[0]-1, end:ODO_IMG_HEIGHT_V_X_RANGE[1]-1}
    )

    // console.debug(`subRawImg.shape is:`,subRawImg.shape)

    let vertDegPerPixel = FOV_VERT_DEGREE / subRawImg.length

    // Adjust image based on yaw offset
    if (minOffsetYawRot > 0) {
        subRawImg = subRawImg.at(
            {start:0, end:subRawImg.shape[0]},
            {start:minOffsetYawRot, end:subRawImg.shape[1]}
        )
    } else {
        subRawImg = subRawImg.at(
            {start:0, end:subRawImg.shape[0]}, 
            {start:0, end:subRawImg.shape[1]-minOffsetYawRot}
        )
        // original: subRawImg = subRawImg(:, 1 : end -(-minOffsetYawRot));
        // note: I really don't understand the original code's (end -(-minOffsetYawRot))
    }
    // console.debug(`subRawImg.shape is:`,subRawImg.shape)
    // crappyRenderAsAsciiGrayscale(subRawImg.at([0,10], [0,10]))

    sideEffects.SUB_HEIGHT_V_IMG = subRawImg

    // Compute y-sums (sum of intensities along each row)
    let avgYIntensity = subRawImg.sum() / subRawImg.shape[0]
    let imageYSums = subRawImg.sum(1).div(avgYIntensity)
    
    let { minimumOffset: minOffsetHeightV, minimumDifferenceIntensity: minDiffIntensityHeight } = compareSegments({
        seg1: imageYSums,
        seg2: sideEffects.PREV_HEIGHT_V_IMG_Y_SUMS,
        shiftLength: ODO_SHIFT_MATCH_VERT,
        compareLengthOfIntensity: imageYSums.length,
    }) 

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
        heightV = sideEffects.PREV_HEIGHT_V
    } else {
        sideEffects.PREV_HEIGHT_V = heightV
    }

    sideEffects.PREV_HEIGHT_V_IMG_Y_SUMS = imageYSums

    // Return the results
    return { transV, yawRotV, heightV, sideEffects }
}

export class VisualOdom {
    constructor({ PREV_YAW_ROT_V_IMG_X_SUMS, ODO_IMG_TRANS_RESIZE_RANGE, PREV_HEIGHT_V_IMG_Y_SUMS, ODO_IMG_HEIGHT_V_RESIZE_RANGE, PREV_TRANS_V_IMG_X_SUMS, ODO_SHIFT_MATCH_HORI, PREV_TRANS_V, PREV_YAW_ROT_V, PREV_HEIGHT_V, ODO_IMG_YAW_ROT_RESIZE_RANGE, SUB_TRANS_IMG, SUB_YAW_ROT_IMG, SUB_HEIGHT_V_IM, }) {
        Object.assign(this, {
            PREV_YAW_ROT_V_IMG_X_SUMS,
            ODO_IMG_TRANS_RESIZE_RANGE,
            PREV_HEIGHT_V_IMG_Y_SUMS,
            ODO_IMG_HEIGHT_V_RESIZE_RANGE,
            PREV_TRANS_V_IMG_X_SUMS,
            ODO_SHIFT_MATCH_HORI,
            PREV_TRANS_V,
            PREV_YAW_ROT_V,
            PREV_HEIGHT_V,
            ODO_IMG_YAW_ROT_RESIZE_RANGE,
            SUB_TRANS_IMG,
            SUB_YAW_ROT_IMG,
            SUB_HEIGHT_V_IM,
        })
        // Initialize the previous image intensity sums
        this.PREV_YAW_ROT_V_IMG_X_SUMS = new Tensor( new Array(this.ODO_IMG_TRANS_RESIZE_RANGE[1]).fill(0) )
        this.PREV_HEIGHT_V_IMG_Y_SUMS = new Tensor( new Array(this.ODO_IMG_HEIGHT_V_RESIZE_RANGE[0]).fill(0) )
        this.PREV_TRANS_V_IMG_X_SUMS = new Tensor( new Array(this.ODO_IMG_TRANS_RESIZE_RANGE[1] - this.ODO_SHIFT_MATCH_HORI).fill(0) )

        // Initialize the previous velocities
        this.PREV_TRANS_V = 0.025
        this.PREV_YAW_ROT_V = 0
        this.PREV_HEIGHT_V = 0

        // Getting the visual data information
        const { RENDER_RATE } = { RENDER_RATE: 1, ...odoGlobals }

        // Initializing variables for previous profiles
        this.preProfilesTransImg = Array(this.ODO_IMG_TRANS_RESIZE_RANGE[1]).fill(0)
        this.preProfilesYawRotImg = Array(this.ODO_IMG_YAW_ROT_RESIZE_RANGE[1]).fill(0)
        this.preProfilesPitchRotImg = Array(this.ODO_IMG_HEIGHT_V_RESIZE_RANGE[1]).fill(0)

        this.curRotDir = [0, 0, 0] // Current rotational direction
        this.sumRotAngle = 0

        this.subRotVel = []
        this.transVelVector = []
        this.heightVelVector = []
        this.sumHeight = [0]
        this.offsetYawRotVector = [0]
        this.offsetHeightVVector = [0]

        this.odoMapTrajectory = [[0, 0, 0, 0]]

        // Processing visual odometry
        this.curFrame = -1
    }
    next(curGrayImg) {
        this.curFrame += 1
        
        this.preProfilesTransImg = this.PREV_TRANS_V_IMG_X_SUMS
        this.preProfilesYawRotImg = this.PREV_YAW_ROT_V_IMG_X_SUMS
        let preProfilesHeightVImg = this.PREV_HEIGHT_V_IMG_Y_SUMS
        
        // Simulating visual odometry (transV, yawRotV, heightV)
        var { transV, yawRotV, heightV, sideEffects } = visualOdometryStep(curGrayImg, this)

        // showing what gets changed (sometimes) by visualOdometry
        Object.assign(this, {
            SUB_YAW_ROT_IMG:           sideEffects.SUB_YAW_ROT_IMG,
            SUB_TRANS_IMG:             sideEffects.SUB_TRANS_IMG,
            OFFSET_YAW_ROT:            sideEffects.OFFSET_YAW_ROT,
            PREV_YAW_ROT_V:            sideEffects.PREV_YAW_ROT_V,
            PREV_YAW_ROT_V_IMG_X_SUMS: sideEffects.PREV_YAW_ROT_V_IMG_X_SUMS,
            PREV_TRANS_V_IMG_X_SUMS:   sideEffects.PREV_TRANS_V_IMG_X_SUMS,
            PREV_TRANS_V:              sideEffects.PREV_TRANS_V,
            SUB_HEIGHT_V_IMG:          sideEffects.SUB_HEIGHT_V_IMG,
            OFFSET_HEIGHT_V:           sideEffects.OFFSET_HEIGHT_V,
            PREV_HEIGHT_V:             sideEffects.PREV_HEIGHT_V,
            PREV_HEIGHT_V_IMG_Y_SUMS:  sideEffects.PREV_HEIGHT_V_IMG_Y_SUMS,
        })

        this.subRotVel[this.curFrame] = yawRotV
        this.transVelVector[this.curFrame] = transV
        this.heightVelVector[this.curFrame] = heightV

        this.offsetYawRotVector[this.curFrame] = 0 // Placeholder for the offset
        this.offsetHeightVVector[this.curFrame] = 0

        this.sumHeight[this.curFrame + 1] = this.sumHeight[this.curFrame] + heightV

        // Updating rotational angle
        if (this.sumRotAngle + yawRotV >= 360) {
            this.sumRotAngle = (this.sumRotAngle + yawRotV) % 360
        } else if (this.sumRotAngle + yawRotV <= -360) {
            this.sumRotAngle = this.sumRotAngle + yawRotV + 360
        } else {
            this.sumRotAngle = this.sumRotAngle + yawRotV
        }

        // Direction update
        yawRotV = yawRotV * DEGREE_TO_RADIAN
        this.curRotDir[this.curFrame + 1] = [Math.cos(this.curRotDir[this.curFrame][2] + yawRotV), Math.sin(this.curRotDir[this.curFrame][2] + yawRotV), this.curRotDir[this.curFrame][2] + yawRotV]

        this.odoMapTrajectory[this.curFrame + 1] = [this.odoMapTrajectory[this.curFrame][0] + transV * Math.cos(this.curRotDir[this.curFrame + 1][2]), this.odoMapTrajectory[this.curFrame][1] + transV * Math.sin(this.curRotDir[this.curFrame + 1][2]), this.odoMapTrajectory[this.curFrame][2] + heightV, this.curRotDir[this.curFrame + 1][2]]

        if (this.curFrame % RENDER_RATE === 0) {
            // Placeholder for plot rendering
            // Use libraries such as plotly.js or three.js to plot the graphs and 3D maps
            // console.log("Rendering frame", this.curFrame)
            
            // Function to compute the normalized profile of horizontal translational image
            function normalizeProfileHorizontal(imgMatrix) {
                imgMatrix = imgMatrix.data
                let profilesTransImg = imgMatrix.reduce((acc, row) => acc.map((sum, idx) => sum + row[idx]), Array(imgMatrix[0].length).fill(0))
                let avgIntensity = profilesTransImg.reduce((sum, value) => sum + value, 0) / profilesTransImg.length
                return profilesTransImg.map((value) => value / avgIntensity) // Normalize the profile
            }

            // Function to compute the normalized profile of rotational image
            function normalizeProfileRotational(imgMatrix) {
                imgMatrix = imgMatrix.data
                let profilesYawRotImg = imgMatrix.reduce((acc, row) => acc.map((sum, idx) => sum + row[idx]), Array(imgMatrix[0].length).fill(0))
                let avgIntensity = profilesYawRotImg.reduce((sum, value) => sum + value, 0) / profilesYawRotImg.length
                return profilesYawRotImg.map((value) => value / avgIntensity) // Normalize the profile
            }

            // Function to compute the normalized profile of vertical translational image
            function normalizeProfileVertical(imgMatrix) {
                imgMatrix = imgMatrix.data
                let profilesHeightVImg = imgMatrix.reduce((acc, row) => acc.map((sum, idx) => sum + row[idx]), Array(imgMatrix.length).fill(0))
                let avgIntensity = profilesHeightVImg.reduce((sum, value) => sum + value, 0) / profilesHeightVImg.length
                return profilesHeightVImg.map((value) => value / avgIntensity) // Normalize the profile
            }

            // Example use for computing normalized profiles
            let profilesTransImg = normalizeProfileHorizontal(this.SUB_TRANS_IMG) // Horizontal translational profile
            let profilesYawRotImg = normalizeProfileRotational(this.SUB_YAW_ROT_IMG) // Rotational profile
            let profilesHeightVImg = normalizeProfileVertical(this.SUB_HEIGHT_V_IMG) // Vertical translational profile

            // Compute differences between current and previous profiles (if applicable)
            let diffYawRotImgs = profilesYawRotImg.map((value, idx) => value - this.preProfilesYawRotImg[idx])
            let diffHeightVImgs = profilesHeightVImg.map((value, idx) => value - preProfilesHeightVImg[idx])
            
            return {
                // main data
                transV, yawRotV, heightV, 
                // plotting
                profilesTransImg,
                profilesYawRotImg,
                profilesHeightVImg,
                diffYawRotImgs,
                diffHeightVImgs,
                // globals
                odoGlobals,
                frame,
            }
        }
    }
}