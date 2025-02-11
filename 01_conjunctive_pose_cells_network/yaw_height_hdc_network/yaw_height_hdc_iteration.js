import { clamp, circShift } from "../../utils/misc.js"

// TODO: needs testing, and needs rewriting with tensors
export function yawHeightHdcIteration(vtId, yawRotV, heightV, yawGlobals) {
    // yawRotV and heightV are from visual odometry, e.g. vestibular input
    // vtId (specifically VT[vtId]) is information about the most relevent visual landmark memory, for anchoring

    // Pose cell update steps:
    // 1. Add view template energy
    // 2. Local excitation
    // 3. Local inhibition
    // 4. Global inhibition
    // 5. Normalisation
    // 6. Path Integration (yawRotV then heightV)

    const {
        YAW_HEIGHT_HDC, // The HD cells of yaw and height conjunctively
        YAW_HEIGHT_HDC_Y_DIM, // The dimension of yaw in yaw_height_hdc network
        YAW_HEIGHT_HDC_H_DIM, // The dimension of height in yaw_height_hdc network
        YAW_HEIGHT_HDC_EXCIT_Y_DIM, // The dimension of local excitation weight matrix for yaw
        YAW_HEIGHT_HDC_EXCIT_H_DIM, // The dimension of local excitation weight matrix for height
        YAW_HEIGHT_HDC_INHIB_Y_DIM, // The dimension of local inhibition weight matrix for yaw
        YAW_HEIGHT_HDC_INHIB_H_DIM, // The dimension of local inhibition weight matrix for height
        YAW_HEIGHT_HDC_GLOBAL_INHIB, // The g.inhibition value
        YAW_HEIGHT_HDC_VT_INJECT_ENERGY, // The amount of energy injected when a view template is re-seen
        YAW_HEIGHT_HDC_EXCIT_Y_WRAP, // The excit wrap of yaw in yaw_height_hdc network
        YAW_HEIGHT_HDC_EXCIT_H_WRAP, // The excit wrap of height in yaw_height_hdc network
        YAW_HEIGHT_HDC_INHIB_Y_WRAP, // The inhibit wrap of yaw in yaw_height_hdc network
        YAW_HEIGHT_HDC_INHIB_H_WRAP, // The inhibit wrap of height in yaw_height_hdc network
        YAW_HEIGHT_HDC_EXCIT_WEIGHT, // The weight of excitation in yaw_height_hdc network
        YAW_HEIGHT_HDC_INHIB_WEIGHT, // The weight of inhibition in yaw_height_hdc network
        YAW_HEIGHT_HDC_Y_TH_SIZE, // The yaw theta size of each unit in radian, 2*pi/ g.YAW_HEIGHT_HDC_Y_DIM
        YAW_HEIGHT_HDC_H_SIZE, // radian e.g. 2*pi/360 = 0.0175
        VT, // The visual templete
    } = yawGlobals
    // this is normally a 36x36 matrix
    let headDirectionCells = structuredClone(YAW_HEIGHT_HDC)

    // Step 1: Add view template energy
    let bestMatchingVisualTemplate = VT[vtId]
    if (bestMatchingVisualTemplate.first !== 1) {
        const memoryOfVisualTemplate = {
            azimuth: Math.round(bestMatchingVisualTemplate.hdc_yaw),
            pitch: Math.round(bestMatchingVisualTemplate.hdc_height),
        }
        // TODO: while the original code did a clamp, this should probably be a modulo-like operation that wraps around
        const azimuth = clamp(memoryOfVisualTemplate.azimuth, {min: 1, max: YAW_HEIGHT_HDC_Y_DIM})
        const pitch = clamp(memoryOfVisualTemplate.pitch, {min: 1, max: YAW_HEIGHT_HDC_H_DIM})
        
        const magicNumber1 = 30
        const magicNumber2 = 1.2
        let energy = YAW_HEIGHT_HDC_VT_INJECT_ENERGY * (1/magicNumber1) * (magicNumber1 - Math.exp(magicNumber2 * bestMatchingVisualTemplate.decay))
        if (energy > 0) {
            // this seems to be the equivanlent a neuron signal. The visual landmark (effectively) is trying to activat a neuron right here
            // i think... --Jeff
            headDirectionCells[azimuth - 1][pitch - 1] += energy // Adjusting for 0-based indexing
        }
    }

    // Step 2: Local excitation (yaw_height_hdc_local_excitation)
    let yawHeightHdcLocalExcitNew = Array(YAW_HEIGHT_HDC_Y_DIM)
        .fill()
        .map(() => Array(YAW_HEIGHT_HDC_H_DIM).fill(0))

    for (let h = 0; h < YAW_HEIGHT_HDC_H_DIM; h++) {
        for (let y = 0; y < YAW_HEIGHT_HDC_Y_DIM; y++) {
            if (headDirectionCells[y][h] !== 0) {
                let yWrap = YAW_HEIGHT_HDC_EXCIT_Y_WRAP.slice(y, y + YAW_HEIGHT_HDC_EXCIT_Y_DIM)
                let hWrap = YAW_HEIGHT_HDC_EXCIT_H_WRAP.slice(h, h + YAW_HEIGHT_HDC_EXCIT_H_DIM)
                for (let yIndex of yWrap) {
                    for (let hIndex of hWrap) {
                        yawHeightHdcLocalExcitNew[yIndex][hIndex] += headDirectionCells[y][h] * YAW_HEIGHT_HDC_EXCIT_WEIGHT
                    }
                }
            }
        }
    }

    headDirectionCells = yawHeightHdcLocalExcitNew

    // Step 3: Local inhibition (yaw_height_hdc_local_inhibition)
    let yawHeightHdcLocalInhibNew = Array(YAW_HEIGHT_HDC_Y_DIM)
        .fill()
        .map(() => Array(YAW_HEIGHT_HDC_H_DIM).fill(0))

    for (let h = 0; h < YAW_HEIGHT_HDC_H_DIM; h++) {
        for (let y = 0; y < YAW_HEIGHT_HDC_Y_DIM; y++) {
            if (headDirectionCells[y][h] !== 0) {
                let yWrap = YAW_HEIGHT_HDC_INHIB_Y_WRAP.slice(y, y + YAW_HEIGHT_HDC_INHIB_Y_DIM)
                let hWrap = YAW_HEIGHT_HDC_INHIB_H_WRAP.slice(h, h + YAW_HEIGHT_HDC_INHIB_H_DIM)
                for (let yIndex of yWrap) {
                    for (let hIndex of hWrap) {
                        yawHeightHdcLocalInhibNew[yIndex][hIndex] += headDirectionCells[y][h] * YAW_HEIGHT_HDC_INHIB_WEIGHT
                    }
                }
            }
        }
    }

    headDirectionCells = headDirectionCells.map((row, i) => row.map((cell, j) => cell - yawHeightHdcLocalInhibNew[i][j]))

    // Step 4: Global inhibition
    headDirectionCells = headDirectionCells.map((row) => row.map((cell) => (cell >= YAW_HEIGHT_HDC_GLOBAL_INHIB ? cell - YAW_HEIGHT_HDC_GLOBAL_INHIB : 0)))

    // Step 5: Normalisation
    let total = headDirectionCells.flat().reduce((acc, val) => acc + val, 0)
    headDirectionCells = headDirectionCells.map((row) => row.map((cell) => cell / total))

    // Step 6: Path Integration (yawRotV then heightV)
    function circshift(array, shift) { // TODO: check if this lines up with MATLAB version
        return array.map((row, rowIndex) => {
            return row.map((_, colIndex) => {
                let newRowIndex = (rowIndex + shift[0]) % YAW_HEIGHT_HDC_Y_DIM
                let newColIndex = (colIndex + shift[1]) % YAW_HEIGHT_HDC_H_DIM
                return array[newRowIndex][newColIndex]
            })
        })
    }

    if (yawRotV !== 0) {
        let weight = (Math.abs(yawRotV) / YAW_HEIGHT_HDC_Y_TH_SIZE) % 1
        if (weight === 0) weight = 1.0

        let shiftValue = Math.floor(Math.abs(yawRotV) / YAW_HEIGHT_HDC_Y_TH_SIZE) * Math.sign(yawRotV)
        headDirectionCells = circshift(headDirectionCells, [shiftValue, 0])
            .map((row) => row.map((cell) => cell * (1 - weight)))
            .map((row, i) => row.map((cell, j) => cell + circshift(headDirectionCells, [shiftValue + Math.sign(yawRotV), 0])[i][j] * weight))
    }

    if (heightV !== 0) {
        let weight = (Math.abs(heightV) / YAW_HEIGHT_HDC_H_SIZE) % 1
        if (weight === 0) weight = 1.0

        let shiftValue = Math.floor(Math.abs(heightV) / YAW_HEIGHT_HDC_H_SIZE) * Math.sign(heightV)
        headDirectionCells = circshift(YAW_HEIGHT_HDC, [0, shiftValue])
            .map((row) => row.map((cell) => cell * (1 - weight)))
            .map((row, i) => row.map((cell, j) => cell + circshift(YAW_HEIGHT_HDC, [0, shiftValue + Math.sign(heightV)])[i][j] * weight))
    }
    return headDirectionCells

}

// export function yawHeightHdcIteration(vt_id, yawRotV, heightV, g) {
//     // Pose cell update steps
//     // 1. Add view template energy
//     // 2. Local excitation
//     // 3. Local inhibition
//     // 4. Global inhibition
//     // 5. Normalisation
//     // 6. Path Integration (yawRotV then heightV)

//     // "global" inputs
//         // g.YAW_HEIGHT_HDC; // The HD cells of yaw and height conjunctively
//         // g.YAW_HEIGHT_HDC_Y_DIM; // The dimension of yaw in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_H_DIM; // The dimension of height in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_EXCIT_Y_DIM; // The dimension of local excitation weight matrix for yaw
//         // g.YAW_HEIGHT_HDC_EXCIT_H_DIM; // The dimension of local excitation weight matrix for height
//         // g.YAW_HEIGHT_HDC_INHIB_Y_DIM; // The dimension of local inhibition weight matrix for yaw
//         // g.YAW_HEIGHT_HDC_INHIB_H_DIM; // The dimension of local inhibition weight matrix for height
//         // g.YAW_HEIGHT_HDC_GLOBAL_INHIB; // The g.inhibition value
//         // g.YAW_HEIGHT_HDC_VT_INJECT_ENERGY;  // The amount of energy injected when a view template is re-seen
//         // g.YAW_HEIGHT_HDC_EXCIT_Y_WRAP; // The excit wrap of yaw in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_EXCIT_H_WRAP; // The excit wrap of height in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_INHIB_Y_WRAP; // The inhibit wrap of yaw in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_INHIB_H_WRAP; // The inhibit wrap of height in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_EXCIT_WEIGHT; // The weight of excitation in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_INHIB_WEIGHT; // The weight of inhibition in yaw_height_hdc network
//         // g.YAW_HEIGHT_HDC_Y_TH_SIZE;   // The yaw theta size of each unit in radian, 2*pi/ g.YAW_HEIGHT_HDC_Y_DIM
//         // g.YAW_HEIGHT_HDC_H_SIZE;      // radian e.g. 2*pi/360 = 0.0175
//         // g.VT; // The visual templete
//     // mutated global:
//         // g.YAW_HEIGHT_HDC; // The HD cells of yaw and height conjunctively
//     let headDirectionCells = structuredClone(g.YAW_HEIGHT_HDC)

//     // if this isn't a new visual template then add the energy at its associated posecell location
//     if (g.VT(vt_id).first != 1) {
//         let actYaw = min([max([round(g.VT(vt_id).hdc_yaw), 1]), g.YAW_HEIGHT_HDC_Y_DIM]);
//         let actHeight = min([max([round(g.VT(vt_id).hdc_height), 1]), g.YAW_HEIGHT_HDC_H_DIM]);

//         // this decays the amount of energy that is injected at the visual template's posecell location
//         // this is important as the posecell Posecells will errounously snap
//         // for bad visual template matches that occur over long periods (eg a bad matches that
//         // occur while the agent is stationary). This means that multiple visual template's
//         // need to be recognised for a snap to happen
//         energy = g.YAW_HEIGHT_HDC_VT_INJECT_ENERGY * 1/30 * (30 - exp(1.2 * g.VT(vt_id).decay));
//         if (energy > 0) {
//             headDirectionCells[actYaw][actHeight] = headDirectionCells[actYaw][actHeight] + energy;
//         }
//     }

//     // Local excitation: yaw_height_hdc_local_excitation = yaw_height_hdc elements * yaw_height_hdc weights
//     yawHeightHdcLocalExcitNew = zeros(g.YAW_HEIGHT_HDC_Y_DIM, g.YAW_HEIGHT_HDC_H_DIM);
//     for (h = 1 : g.YAW_HEIGHT_HDC_H_DIM) {
//         for (y = 1 : g.YAW_HEIGHT_HDC_Y_DIM) {
//             if (headDirectionCells[y][h] != 0) {
//                 yawHeightHdcLocalExcitNew[
//                     g.YAW_HEIGHT_HDC_EXCIT_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_EXCIT_Y_DIM - 1],
//                     g.YAW_HEIGHT_HDC_EXCIT_H_WRAP[h : h + g.YAW_HEIGHT_HDC_EXCIT_H_DIM - 1]
//                 ] = (
//                     yawHeightHdcLocalExcitNew[
//                         g.YAW_HEIGHT_HDC_EXCIT_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_EXCIT_Y_DIM - 1],
//                         g.YAW_HEIGHT_HDC_EXCIT_H_WRAP[h : h + g.YAW_HEIGHT_HDC_EXCIT_H_DIM - 1]
//                     ] + (
//                         headDirectionCells[y,h] .* g.YAW_HEIGHT_HDC_EXCIT_WEIGHT
//                     )
//                 )
//             }
//         }
//     }
//     headDirectionCells = yawHeightHdcLocalExcitNew;

//     // local inhibition: yaw_height_hdc_local_inhibition = hdc - hdc elements * hdc_inhib weights
//     yawHeightHdcLocalInhibNew = zeros(g.YAW_HEIGHT_HDC_Y_DIM, g.YAW_HEIGHT_HDC_H_DIM);
//     for (h = 1 : g.YAW_HEIGHT_HDC_H_DIM) {
//         for (y = 1 : g.YAW_HEIGHT_HDC_Y_DIM) {
//             if (headDirectionCells[y, h] != 0) {
//                 yawHeightHdcLocalInhibNew[g.YAW_HEIGHT_HDC_INHIB_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_INHIB_Y_DIM - 1],g.YAW_HEIGHT_HDC_INHIB_H_WRAP[h : h + g.YAW_HEIGHT_HDC_INHIB_H_DIM - 1]] =
//                     yawHeightHdcLocalInhibNew[g.YAW_HEIGHT_HDC_INHIB_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_INHIB_Y_DIM - 1],g.YAW_HEIGHT_HDC_INHIB_H_WRAP[h : h + g.YAW_HEIGHT_HDC_INHIB_H_DIM - 1]]  + headDirectionCells[y, h] .* g.YAW_HEIGHT_HDC_INHIB_WEIGHT;
//             }
//         }
//     }
//     headDirectionCells = headDirectionCells - yawHeightHdcLocalInhibNew;

//     // g.inhibition - PC_gi = PC_li elements - inhibition
//     headDirectionCells = (headDirectionCells >= g.YAW_HEIGHT_HDC_GLOBAL_INHIB) .* (headDirectionCells - g.YAW_HEIGHT_HDC_GLOBAL_INHIB);

//     // normalisation
//     total = sum(sum(headDirectionCells));
//     headDirectionCells = headDirectionCells./total;

//     if (yawRotV != 0) {
//         // mod to work out the partial shift amount
//         weight = mod(abs(yawRotV) / g.YAW_HEIGHT_HDC_Y_TH_SIZE, 1);
//         if (weight == 0) {
//             weight = 1.0;
//         }
//         headDirectionCells = circshift(
//                 headDirectionCells,
//                 [sign(yawRotV) * floor(mod(abs(yawRotV) / g.YAW_HEIGHT_HDC_Y_TH_SIZE, g.YAW_HEIGHT_HDC_Y_DIM)) 0]
//             ) * (1.0 - weight) + circshift(
//                 headDirectionCells,
//                 [sign(yawRotV) * ceil(mod(abs(yawRotV) / g.YAW_HEIGHT_HDC_Y_TH_SIZE, g.YAW_HEIGHT_HDC_Y_DIM)) 0]
//             ) * (weight);
//     }

//     if (heightV != 0) {
//         // mod to work out the partial shift amount
//         weight = mod(abs(heightV) / g.YAW_HEIGHT_HDC_H_SIZE, 1);
//         if (weight == 0) {
//             weight = 1.0;
//         }
//         headDirectionCells = circshift(
//                 headDirectionCells,
//                 [0 sign(heightV) * floor(mod(abs(heightV) / g.YAW_HEIGHT_HDC_H_SIZE, g.YAW_HEIGHT_HDC_H_DIM]
//             ) * (1.0 - weight) + circshift(
//                 headDirectionCells,
//                 [0 sign(heightV) * ceil(mod(abs(heightV) / g.YAW_HEIGHT_HDC_H_SIZE, g.YAW_HEIGHT_HDC_H_DIM]
//             ) * (weight);
//     }

//     return headDirectionCells
// }
