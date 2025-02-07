export function vtCompareSegments({ seg1, seg2, vtPanoramic, halfOffsetRange, slenY, slenX, cwlY, cwlX }) {
    let mindiff = 1e7
    let minoffsetX = 0
    let minoffsetY = 0

    // Compare two 1 row * N column matrices
    // For each offset, sum the absolute difference between the two segments

    if (vtPanoramic === 1) {
        for (let halfOffset of halfOffsetRange) {
            // Circular shift seg2 by halfOffset in the X direction
            seg2 = circshift(seg2, [0, halfOffset])

            // First comparison loop for shifting seg1 and seg2
            for (let offsetY = 0; offsetY <= slenY; offsetY++) {
                for (let offsetX = 0; offsetX <= slenX; offsetX++) {
                    let cdiff = absDiff(seg1, seg2, offsetY, offsetX, cwlY, cwlX)
                    if (cdiff < mindiff) {
                        mindiff = cdiff
                        minoffsetX = offsetX
                        minoffsetY = offsetY
                    }
                }
            }

            // Second comparison loop for shifting seg1 and seg2 (in reverse)
            for (let offsetY = 1; offsetY <= slenY; offsetY++) {
                for (let offsetX = 1; offsetX <= slenX; offsetX++) {
                    let cdiff = absDiff(seg1, seg2, -offsetY, -offsetX, cwlY, cwlX)
                    if (cdiff < mindiff) {
                        mindiff = cdiff
                        minoffsetX = -offsetX
                        minoffsetY = -offsetY
                    }
                }
            }
        }
    } else {
        // Standard comparison loop without panoramic flag
        for (let offsetY = 0; offsetY <= slenY; offsetY++) {
            for (let offsetX = 0; offsetX <= slenX; offsetX++) {
                let cdiff = absDiff(seg1, seg2, offsetY, offsetX, cwlY, cwlX)
                if (cdiff < mindiff) {
                    mindiff = cdiff
                    minoffsetX = offsetX
                    minoffsetY = offsetY
                }
            }
        }

        // Reverse comparison loop
        for (let offsetY = 1; offsetY <= slenY; offsetY++) {
            for (let offsetX = 1; offsetX <= slenX; offsetX++) {
                let cdiff = absDiff(seg1, seg2, -offsetY, -offsetX, cwlY, cwlX)
                if (cdiff < mindiff) {
                    mindiff = cdiff
                    minoffsetX = -offsetX
                    minoffsetY = -offsetY
                }
            }
        }
    }

    return { offsetY: minoffsetY, offsetX: minoffsetX, sdif: mindiff }
}

// Helper function to calculate absolute difference
function absDiff(seg1, seg2, offsetY, offsetX, cwlY, cwlX) {
    let diffSum = 0
    let height = cwlY - offsetY
    let width = cwlX - offsetX

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // Adjusting indices based on the offset
            diffSum += Math.abs(seg1[i + offsetY][j + offsetX] - seg2[i][j])
        }
    }

    // Normalize by the area size
    return diffSum / (height * width)
}

// Helper function for circular shift (similar to MATLAB's circshift)
function circshift(arr, shift) {
    let shiftedArr = arr.map((row) => [...row]) // Deep copy of the 2D array

    for (let i = 0; i < arr.length; i++) {
        // Shift rows by the specified amount
        shiftedArr[i] = shiftedArr[i].slice(shift[1]).concat(shiftedArr[i].slice(0, shift[1]))
    }
    return shiftedArr
}
