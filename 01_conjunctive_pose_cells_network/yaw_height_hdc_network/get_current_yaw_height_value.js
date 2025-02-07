// 
// summary: I believe this function looks at the "neurons" of the HDC, and converts them into azimuth ("yaw") and pitch ("height") values.
// 
export function getCurrentYawHeightValue(yawGlobals) {
    // Returns the approximate averaged center of the most active activity packet.
    // This implementation averages the cells around the maximally activated cell.
    // Population Vector Decoding.
    const {
        YAW_HEIGHT_HDC, // The HD cells of yaw and height conjunctively
        YAW_HEIGHT_HDC_Y_DIM, // The dimension of yaw in yaw_height_hdc network
        YAW_HEIGHT_HDC_H_DIM, // The dimension of height in yaw_height_hdc network
        YAW_HEIGHT_HDC_MAX_Y_WRAP,
        YAW_HEIGHT_HDC_MAX_H_WRAP,
        YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP,
        YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP,
        YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP,
        YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP,
        YAW_HEIGHT_HDC_PACKET_SIZE,
        YAW_HEIGHT_HDC_Y_TH_SIZE,
        YAW_HEIGHT_HDC_H_SIZE,
    } = yawGlobals

    // Find the max activated cell
    let indexes = []
    for (let i = 0; i < YAW_HEIGHT_HDC.length; i++) {
        if (YAW_HEIGHT_HDC[i] !== 0) {
            indexes.push(i)
        }
    }

    let maxValue = -Infinity
    let maxIndex = -1
    for (let i = 0; i < indexes.length; i++) {
        if (YAW_HEIGHT_HDC[indexes[i]] > maxValue) {
            maxValue = YAW_HEIGHT_HDC[indexes[i]]
            maxIndex = indexes[i]
        }
    }

    const y = Math.floor(maxIndex / YAW_HEIGHT_HDC_H_DIM)
    const h = maxIndex % YAW_HEIGHT_HDC_H_DIM

    // Take the max activated cell +- AVG_CELL in 2d space
    let tempYawHeightHdc = Array(YAW_HEIGHT_HDC_Y_DIM)
        .fill()
        .map(() => Array(YAW_HEIGHT_HDC_H_DIM).fill(0))

    // Copy the corresponding region around the max activated cell into tempYawHeightHdc
    for (let i = 0; i < YAW_HEIGHT_HDC_PACKET_SIZE * 2; i++) {
        for (let j = 0; j < YAW_HEIGHT_HDC_PACKET_SIZE * 2; j++) {
            tempYawHeightHdc[YAW_HEIGHT_HDC_MAX_Y_WRAP[y + i]][YAW_HEIGHT_HDC_MAX_H_WRAP[h + j]] = YAW_HEIGHT_HDC[YAW_HEIGHT_HDC_MAX_Y_WRAP[y + i] * YAW_HEIGHT_HDC_H_DIM + YAW_HEIGHT_HDC_MAX_H_WRAP[h + j]]
        }
    }

    // Sum up the components
    const yawSumSin = sumProduct(YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP, sum2D(tempYawHeightHdc, 1))
    const yawSumCos = sumProduct(YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP, sum2D(tempYawHeightHdc, 1))

    const heightSumSin = sumProduct(YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP, sum2D(tempYawHeightHdc, 0))
    const heightSumCos = sumProduct(YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP, sum2D(tempYawHeightHdc, 0))

    const outYawTheta = (Math.atan2(yawSumSin, yawSumCos) / YAW_HEIGHT_HDC_Y_TH_SIZE) % YAW_HEIGHT_HDC_Y_DIM
    const outHeightValue = (Math.atan2(heightSumSin, heightSumCos) / YAW_HEIGHT_HDC_H_SIZE) % YAW_HEIGHT_HDC_H_DIM

    return [outYawTheta, outHeightValue]
}

// Helper function for summing a 2D array across a specific dimension (0 for columns, 1 for rows)
function sum2D(matrix, dim) {
    const result = []
    const rows = matrix.length
    const cols = matrix[0].length

    if (dim === 0) {
        // Sum along columns
        for (let i = 0; i < cols; i++) {
            let sum = 0
            for (let j = 0; j < rows; j++) {
                sum += matrix[j][i]
            }
            result.push(sum)
        }
    } else if (dim === 1) {
        // Sum along rows
        for (let i = 0; i < rows; i++) {
            let sum = 0
            for (let j = 0; j < cols; j++) {
                sum += matrix[i][j]
            }
            result.push(sum)
        }
    }
    return result
}

// Helper function for summing products of two arrays (dot product)
function sumProduct(array1, array2) {
    return array1.reduce((sum, val, index) => sum + val * array2[index], 0)
}
