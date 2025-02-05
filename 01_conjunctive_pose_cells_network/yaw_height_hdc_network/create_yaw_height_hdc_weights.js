export function createYawHeightHdcWeights(yawDim, heightDim, yawVar, heightVar) {
    // Calculate the centers for yaw and height dimensions
    const yawDimCentre = Math.floor(yawDim / 2) + 1
    const heightDimCentre = Math.floor(heightDim / 2) + 1

    // Create an empty 2D array to store weights
    let weight = Array.from({ length: yawDim }, () => new Array(heightDim).fill(0))

    // Loop over all yaw and height values
    for (let h = 0; h < heightDim; h++) {
        for (let y = 0; y < yawDim; y++) {
            // Calculate the weight using the formula
            weight[y][h] = (1 / (yawVar * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(y - yawDimCentre, 2) / (2 * Math.pow(yawVar, 2))) * (1 / (heightVar * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(h - heightDimCentre, 2) / (2 * Math.pow(heightVar, 2)))
        }
    }

    // Normalize the weight array
    let total = weight.flat(Infinity).reduce((acc, val) => acc + val, 0) // Flatten the 2D array and sum all values
    for (let i = 0; i < yawDim; i++) {
        for (let j = 0; j < heightDim; j++) {
            weight[i][j] = weight[i][j] / total
        }
    }

    return weight
}
