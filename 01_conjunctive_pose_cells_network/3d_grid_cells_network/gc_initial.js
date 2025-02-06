export function gcInitial(input) {
    // inputs:
        // input.GC_X_DIM,
        // input.GC_Y_DIM,
        // input.GC_Z_DIM,
        // input.GC_EXCIT_X_DIM,
        // input.GC_EXCIT_Y_DIM,
        // input.GC_EXCIT_Z_DIM,
        // input.GC_INHIB_X_DIM,
        // input.GC_INHIB_Y_DIM,
        // input.GC_INHIB_Z_DIM,
        // input.GC_GLOBAL_INHIB,
        // input.GC_VT_INJECT_ENERGY,
        // input.GC_EXCIT_X_VAR,
        // input.GC_EXCIT_Y_VAR,
        // input.GC_EXCIT_Z_VAR,
        // input.GC_INHIB_X_VAR,
        // input.GC_INHIB_Y_VAR,
        // input.GC_INHIB_Z_VAR,
        // input.GC_HORI_TRANS_V_SCALE,
        // input.GC_VERT_TRANS_V_SCALE,
        // input.GC_PACKET_SIZE,

    let generatedOutputs = {}
    // The weight of excitation in 3D grid cell network
    generatedOutputs.GC_EXCIT_WEIGHT = createGcWeights(input.GC_EXCIT_X_DIM, input.GC_EXCIT_Y_DIM, input.GC_EXCIT_Z_DIM, input.GC_EXCIT_X_VAR, input.GC_EXCIT_Y_VAR, input.GC_EXCIT_Z_VAR)

    // The weight of inhibition in 3D grid cell network
    generatedOutputs.GC_INHIB_WEIGHT = createGcWeights(input.GC_INHIB_X_DIM, input.GC_INHIB_Y_DIM, input.GC_INHIB_Z_DIM, input.GC_INHIB_X_VAR, input.GC_INHIB_Y_VAR, input.GC_INHIB_Z_VAR)

    // Convenience constants
    generatedOutputs.GC_EXCIT_X_DIM_HALF = Math.floor(input.GC_EXCIT_X_DIM / 2)
    generatedOutputs.GC_EXCIT_Y_DIM_HALF = Math.floor(input.GC_EXCIT_Y_DIM / 2)
    generatedOutputs.GC_EXCIT_Z_DIM_HALF = Math.floor(input.GC_EXCIT_Z_DIM / 2)

    generatedOutputs.GC_INHIB_X_DIM_HALF = Math.floor(input.GC_INHIB_X_DIM / 2)
    generatedOutputs.GC_INHIB_Y_DIM_HALF = Math.floor(input.GC_INHIB_Y_DIM / 2)
    generatedOutputs.GC_INHIB_Z_DIM_HALF = Math.floor(input.GC_INHIB_Z_DIM / 2)

    // The wrap for excitation and inhibition
    generatedOutputs.GC_EXCIT_X_WRAP = Array.from({ length: input.GC_X_DIM }, (_, i) => (i + input.GC_X_DIM - generatedOutputs.GC_EXCIT_X_DIM_HALF) % input.GC_X_DIM) // TODO: check if the js modulo is fine here (it works different than MATLAB modulo)
    generatedOutputs.GC_EXCIT_Y_WRAP = Array.from({ length: input.GC_Y_DIM }, (_, i) => (i + input.GC_Y_DIM - generatedOutputs.GC_EXCIT_Y_DIM_HALF) % input.GC_Y_DIM)
    generatedOutputs.GC_EXCIT_Z_WRAP = Array.from({ length: input.GC_Z_DIM }, (_, i) => (i + input.GC_Z_DIM - generatedOutputs.GC_EXCIT_Z_DIM_HALF) % input.GC_Z_DIM)

    generatedOutputs.GC_INHIB_X_WRAP = Array.from({ length: input.GC_X_DIM }, (_, i) => (i + input.GC_X_DIM - generatedOutputs.GC_INHIB_X_DIM_HALF) % input.GC_X_DIM)
    generatedOutputs.GC_INHIB_Y_WRAP = Array.from({ length: input.GC_Y_DIM }, (_, i) => (i + input.GC_Y_DIM - generatedOutputs.GC_INHIB_Y_DIM_HALF) % input.GC_Y_DIM)
    generatedOutputs.GC_INHIB_Z_WRAP = Array.from({ length: input.GC_Z_DIM }, (_, i) => (i + input.GC_Z_DIM - generatedOutputs.GC_INHIB_Z_DIM_HALF) % input.GC_Z_DIM)

    // The cell size of each unit in meters
    generatedOutputs.GC_X_TH_SIZE = (2 * Math.PI) / input.GC_X_DIM
    generatedOutputs.GC_Y_TH_SIZE = (2 * Math.PI) / input.GC_Y_DIM
    generatedOutputs.GC_Z_TH_SIZE = (2 * Math.PI) / input.GC_Y_DIM

    // Lookups for finding the center of the grid cell in GRIDCELLS
    generatedOutputs.GC_X_SUM_SIN_LOOKUP = Array.from({ length: input.GC_X_DIM }, (_, i) => Math.sin((i + 1) * generatedOutputs.GC_X_TH_SIZE))
    generatedOutputs.GC_X_SUM_COS_LOOKUP = Array.from({ length: input.GC_X_DIM }, (_, i) => Math.cos((i + 1) * generatedOutputs.GC_X_TH_SIZE))

    generatedOutputs.GC_Y_SUM_SIN_LOOKUP = Array.from({ length: input.GC_Y_DIM }, (_, i) => Math.sin((i + 1) * generatedOutputs.GC_Y_TH_SIZE))
    generatedOutputs.GC_Y_SUM_COS_LOOKUP = Array.from({ length: input.GC_Y_DIM }, (_, i) => Math.cos((i + 1) * generatedOutputs.GC_Y_TH_SIZE))

    generatedOutputs.GC_Z_SUM_SIN_LOOKUP = Array.from({ length: input.GC_Z_DIM }, (_, i) => Math.sin((i + 1) * generatedOutputs.GC_Z_TH_SIZE))
    generatedOutputs.GC_Z_SUM_COS_LOOKUP = Array.from({ length: input.GC_Z_DIM }, (_, i) => Math.cos((i + 1) * generatedOutputs.GC_Z_TH_SIZE))

    // Wrap for finding maximum activity packet
    generatedOutputs.GC_MAX_X_WRAP = Array.from({ length: input.GC_PACKET_SIZE }, (_, i) => (i + input.GC_X_DIM - input.GC_PACKET_SIZE) % input.GC_X_DIM)
    generatedOutputs.GC_MAX_Y_WRAP = Array.from({ length: input.GC_PACKET_SIZE }, (_, i) => (i + input.GC_Y_DIM - input.GC_PACKET_SIZE) % input.GC_Y_DIM)
    generatedOutputs.GC_MAX_Z_WRAP = Array.from({ length: input.GC_PACKET_SIZE }, (_, i) => (i + input.GC_Y_DIM - input.GC_PACKET_SIZE) % input.GC_Y_DIM)

    // Get the initial position in the grid cell network
    let gcX = Math.floor(GC_X_DIM / 2);  // in 1:36
    let gcY = Math.floor(GC_Y_DIM / 2);  // in 1:36
    let gcZ = Math.floor(GC_Z_DIM / 2);  // in 1:36

    // Initialize GRIDCELLS with zeros
    let GRIDCELLS = Array(input.GC_X_DIM)
        .fill()
        .map(() =>
            Array(input.GC_Y_DIM)
                .fill()
                .map(() => Array(input.GC_Z_DIM).fill(0))
        )
    GRIDCELLS[gcX][gcY][gcZ] = 1

    // The path of maximum active XYZ coordinates
    let MAX_ACTIVE_XYZ_PATH = [gcX, gcY, gcZ]

    return {
        GRIDCELLS,
        MAX_ACTIVE_XYZ_PATH,
        gcInitialPosition: [gcX, gcY, gcZ],
        ...input,
        ...generatedOutputs,
    }
}

// internal helper
function createGcWeights(xDim, yDim, zDim, xVar, yVar, zVar) {
    // Creates a 3D normalized distribution of size dimension^3 with a variance of var.

    const xDimCentre = Math.floor(xDim / 2) + 1
    const yDimCentre = Math.floor(yDim / 2) + 1
    const zDimCentre = Math.floor(zDim / 2) + 1

    let weight = new Array(xDim)
    for (let x = 0; x < xDim; x++) {
        weight[x] = new Array(yDim)
        for (let y = 0; y < yDim; y++) {
            weight[x][y] = new Array(zDim).fill(0)
        }
    }

    // Calculate the weight for each element in the 3D array
    for (let z = 0; z < zDim; z++) {
        for (let x = 0; x < xDim; x++) {
            for (let y = 0; y < yDim; y++) {
                weight[x][y][z] = (
                    (
                        1 / (xVar * Math.sqrt(2 * Math.PI))
                    ) * (
                        Math.exp(
                            (-(x - xDimCentre) ** 2)
                            /
                            (2 * xVar ** 2)
                        )
                    ) * (
                        1 / (yVar * Math.sqrt(2 * Math.PI))
                    ) * (
                        Math.exp(
                            (-(y - yDimCentre) ** 2)
                            /
                            (2 * yVar ** 2)
                        )
                    ) * (
                        1 / (zVar * Math.sqrt(2 * Math.PI))
                    ) * (
                        Math.exp(
                            (-(z - zDimCentre) ** 2)
                            /
                            (2 * zVar ** 2)
                        )
                    )
                )
            }
        }
    }

    // Ensure that the weights are normalized
    let total = 0
    for (let x = 0; x < xDim; x++) {
        for (let y = 0; y < yDim; y++) {
            for (let z = 0; z < zDim; z++) {
                total += weight[x][y][z]
            }
        }
    }

    // Normalize the weight array
    for (let x = 0; x < xDim; x++) {
        for (let y = 0; y < yDim; y++) {
            for (let z = 0; z < zDim; z++) {
                weight[x][y][z] /= total
            }
        }
    }

    return weight
}