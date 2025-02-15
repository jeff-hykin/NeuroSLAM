import { Tensor, Ops } from "../utils/tensor_wrapper.js"
import { circShift } from "../utils/misc.js"

// summary:
//     I believe this is supposed to find the offsets that minimize the differences between the two images
//     and then report how large of a mismatch there is (with the best offset)
//     however, I'm not sure this truly finding the best offset
//     its almost certainly not finding it optimally/quickly
//     the panoramic flag is very confusing, I don't understand why the halfOffset helps
//     and I don't see how this is biologically based, unless there's a way to map this to a convolutional network
//     maybe its also kind of a way to bypass a lack of a foveation system, by simply foveating over everything
export function vtCompareSegments({ seg1, seg2, vtPanoramic, halfOffsetRange, maxYOffset, maxXOffset }) {
    // explaination:
    //     seg1 is the current image (matrix)
    //     seg2 is the template image (matrix)
    //     this function returns the offset and the difference between the two images
    const height = seg1.length
    const width = seg1[0].length
    
    let minDiff = 1e7
    let minOffsetX = 0
    let minOffsetY = 0

    // Compare two 1 row * N column matrices
    // For each offset, sum the absolute difference between the two segments

    if (vtPanoramic === 1) { // true for SynPanData, false for other datasets
        // halfOffsetRange.length == 2 (start, end)
        for (let halfOffset of halfOffsetRange) {
            // Circular shift seg2 by halfOffset in the X direction
            seg2 = circShift(seg2, [0, halfOffset])

            // First comparison loop for shifting seg1 and seg2
            for (let offsetY = 0; offsetY <= maxYOffset; offsetY++) {
                for (let offsetX = 0; offsetX <= maxXOffset; offsetX++) {
                    const seg1Slice = seg1.at(
                        {start:offsetY, end:height}, // TODO: probably an off-by-one error somewhere here -- Jeff
                        {start:offsetX, end:width}, // TODO: probably an off-by-one error somewhere here -- Jeff
                    )
                    const seg2Slice = seg2.at(
                        {start:0, end:height-offsetY}, // TODO: probably an off-by-one error somewhere here -- Jeff
                        {start:0, end:width-offsetX}, // TODO: probably an off-by-one error somewhere here -- Jeff
                    )
                    const difference = seg1Slice.subtract(seg2Slice)
                    const cDiff = Ops.abs(difference)
                    // matlab code reference:
                    //     cdiff = abs(
                    //         seg1(1 + offsetY : height , 1 + offsetX : width)
                    //         - seg2(1 : height - offsetY, 1 : width - offsetX)
                    //     );

                    if (cDiff < minDiff) {
                        minDiff = cDiff
                        minOffsetX = offsetX
                        minOffsetY = offsetY
                    }
                }
            }

            // Second comparison loop for shifting seg1 and seg2 (in reverse)
            for (let offsetY = 1; offsetY <= maxYOffset; offsetY++) {
                for (let offsetX = 1; offsetX <= maxXOffset; offsetX++) {
                    let cDiff = absDiff(seg1, seg2, -offsetY, -offsetX, height, width)
                    if (cDiff < minDiff) {
                        minDiff = cDiff
                        minOffsetX = -offsetX
                        minOffsetY = -offsetY
                    }
                }
            }
        }
    } else {
        // Standard comparison loop without panoramic flag
        for (let offsetY = 0; offsetY <= maxYOffset; offsetY++) {
            for (let offsetX = 0; offsetX <= maxXOffset; offsetX++) {
                let cDiff = absDiff(seg1, seg2, offsetY, offsetX, height, width)
                if (cDiff < minDiff) {
                    minDiff = cDiff
                    minOffsetX = offsetX
                    minOffsetY = offsetY
                }
            }
        }

        // Reverse comparison loop
        for (let offsetY = 1; offsetY <= maxYOffset; offsetY++) {
            for (let offsetX = 1; offsetX <= maxXOffset; offsetX++) {
                let cDiff = absDiff(seg1, seg2, -offsetY, -offsetX, height, width)
                if (cDiff < minDiff) {
                    minDiff = cDiff
                    minOffsetX = -offsetX
                    minOffsetY = -offsetY
                }
            }
        }
    }

    return { offsetY: minOffsetY, offsetX: minOffsetX, sdif: minDiff }
}

// Helper function to calculate absolute difference
function absDiff(seg1, seg2, offsetY, offsetX, height, width) {
    let diffSum = 0
    let height = height - offsetY
    let width = width - offsetX

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // Adjusting indices based on the offset
            diffSum += Math.abs(seg1[i + offsetY][j + offsetX] - seg2[i][j])
        }
    }

    // Normalize by the area size
    return diffSum / (height * width)
}