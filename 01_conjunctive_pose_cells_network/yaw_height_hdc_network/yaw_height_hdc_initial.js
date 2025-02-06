export function yawHeightHdcInitial(input) {
    // Create excitation weight in yaw_height_hdc network
    let YAW_HEIGHT_HDC_EXCIT_WEIGHT = createYawHeightHdcWeights(YAW_HEIGHT_HDC_EXCIT_Y_DIM, YAW_HEIGHT_HDC_EXCIT_H_DIM, YAW_HEIGHT_HDC_EXCIT_Y_VAR, YAW_HEIGHT_HDC_EXCIT_H_VAR);

    // Create inhibition weight in yaw_height_hdc network
    let YAW_HEIGHT_HDC_INHIB_WEIGHT = createYawHeightHdcWeights(YAW_HEIGHT_HDC_INHIB_Y_DIM, YAW_HEIGHT_HDC_INHIB_H_DIM, YAW_HEIGHT_HDC_INHIB_Y_VAR, YAW_HEIGHT_HDC_INHIB_Y_VAR);

    // Convenience constants (half dimensions)
    let YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF = Math.floor(YAW_HEIGHT_HDC_EXCIT_Y_DIM / 2);
    let YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF = Math.floor(YAW_HEIGHT_HDC_EXCIT_H_DIM / 2);
    let YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF = Math.floor(YAW_HEIGHT_HDC_INHIB_Y_DIM / 2);
    let YAW_HEIGHT_HDC_INHIB_H_DIM_HALF = Math.floor(YAW_HEIGHT_HDC_INHIB_H_DIM / 2);

    // Yaw theta size of each unit in radian
    let YAW_HEIGHT_HDC_Y_TH_SIZE = (2 * Math.PI) / YAW_HEIGHT_HDC_Y_DIM;

    // Height theta size of each unit in radian
    let YAW_HEIGHT_HDC_H_SIZE = (2 * Math.PI) / YAW_HEIGHT_HDC_H_DIM;

    // Lookup for finding the center of the hdcell in YAW_HEIGHT_HDC
    let YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP = Array.from({ length: YAW_HEIGHT_HDC_Y_DIM }, (_, i) => Math.sin((i + 1) * YAW_HEIGHT_HDC_Y_TH_SIZE));
    let YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP = Array.from({ length: YAW_HEIGHT_HDC_Y_DIM }, (_, i) => Math.cos((i + 1) * YAW_HEIGHT_HDC_Y_TH_SIZE));

    let YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP = Array.from({ length: YAW_HEIGHT_HDC_H_DIM }, (_, i) => Math.sin((i + 1) * YAW_HEIGHT_HDC_H_SIZE));
    let YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP = Array.from({ length: YAW_HEIGHT_HDC_H_DIM }, (_, i) => Math.cos((i + 1) * YAW_HEIGHT_HDC_H_SIZE));

    // Wrap for excitation in yaw_height_hdc network
    let YAW_HEIGHT_HDC_EXCIT_Y_WRAP = [
        ...Array.from({ length: YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF + 1 }, (_, i) => i),
        ...Array.from({ length: YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF }, (_, i) => YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF + i)
    ];

    // Wrap for excitation in height in yaw_height_hdc network
    let YAW_HEIGHT_HDC_EXCIT_H_WRAP = [
        ...Array.from({ length: YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF + 1 }, (_, i) => i),
        ...Array.from({ length: YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF }, (_, i) => YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF + i)
    ];

    // Wrap for inhibition in yaw_height_hdc network
    let YAW_HEIGHT_HDC_INHIB_Y_WRAP = [
        ...Array.from({ length: YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF + 1 }, (_, i) => i),
        ...Array.from({ length: YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF }, (_, i) => YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF + i)
    ];

    // Wrap for inhibition in height in yaw_height_hdc network
    let YAW_HEIGHT_HDC_INHIB_H_WRAP = [
        ...Array.from({ length: YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_INHIB_H_DIM_HALF + 1 }, (_, i) => i),
        ...Array.from({ length: YAW_HEIGHT_HDC_INHIB_H_DIM_HALF }, (_, i) => YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_INHIB_H_DIM_HALF + i)
    ];

    // Wrap for finding maximum activity packet
    let YAW_HEIGHT_HDC_MAX_Y_WRAP = [
        ...Array.from({ length: YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_PACKET_SIZE + 1 }, (_, i) => i),
        ...Array.from({ length: YAW_HEIGHT_HDC_PACKET_SIZE }, (_, i) => YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_PACKET_SIZE + i)
    ];
    let YAW_HEIGHT_HDC_MAX_H_WRAP = [
        ...Array.from({ length: YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_PACKET_SIZE + 1 }, (_, i) => i),
        ...Array.from({ length: YAW_HEIGHT_HDC_PACKET_SIZE }, (_, i) => YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_PACKET_SIZE + i)
    ];

    // Set initial position in the hdcell network
    let curYawTheta = 1; // in 1:36
    let curHeight = 1; // in 1:36

    let YAW_HEIGHT_HDC = Array.from({ length: YAW_HEIGHT_HDC_Y_DIM }, () => Array(YAW_HEIGHT_HDC_H_DIM).fill(0));
    YAW_HEIGHT_HDC[curYawTheta - 1][curHeight - 1] = 1; // Adjust for 0-based index

    // Maximum active yaw-height history path
    let MAX_ACTIVE_YAW_HEIGHT_HIS_PATH = [[curYawTheta, curHeight]];

    let output = {
        ...input,
        // inputs should contain:
            // YAW_HEIGHT_HDC_Y_DIM
            // YAW_HEIGHT_HDC_H_DIM
            // YAW_HEIGHT_HDC_EXCIT_Y_DIM
            // YAW_HEIGHT_HDC_EXCIT_H_DIM
            // YAW_HEIGHT_HDC_INHIB_Y_DIM
            // YAW_HEIGHT_HDC_INHIB_H_DIM
            // YAW_HEIGHT_HDC_EXCIT_Y_VAR
            // YAW_HEIGHT_HDC_EXCIT_H_VAR
            // YAW_HEIGHT_HDC_INHIB_Y_VAR
            // YAW_HEIGHT_HDC_INHIB_H_VAR
            // YAW_HEIGHT_HDC_GLOBAL_INHIB
            // YAW_HEIGHT_HDC_VT_INJECT_ENERGY
            // YAW_ROT_V_SCALE
            // HEIGHT_V_SCALE
            // YAW_HEIGHT_HDC_PACKET_SIZE
        
        YAW_HEIGHT_HDC_EXCIT_WEIGHT,
        YAW_HEIGHT_HDC_INHIB_WEIGHT,
        YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF,
        YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF,
        YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF,
        YAW_HEIGHT_HDC_INHIB_H_DIM_HALF,
        YAW_HEIGHT_HDC_Y_TH_SIZE,
        YAW_HEIGHT_HDC_H_SIZE,
        YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP,
        YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP,
        YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP,
        YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP,
        YAW_HEIGHT_HDC_EXCIT_Y_WRAP,
        YAW_HEIGHT_HDC_EXCIT_H_WRAP,
        YAW_HEIGHT_HDC_INHIB_Y_WRAP,
        YAW_HEIGHT_HDC_INHIB_H_WRAP,
        YAW_HEIGHT_HDC_MAX_Y_WRAP,
        YAW_HEIGHT_HDC_MAX_H_WRAP,
        YAW_HEIGHT_HDC,
        MAX_ACTIVE_YAW_HEIGHT_HIS_PATH,
    }
}

// Function to create weights for yaw-height HDC network
function createYawHeightHdcWeights(yDim, hDim, yVar, hVar) {
    // Example weight creation function, you would implement this similar to the MATLAB version
    // Here, just returning a dummy array for the sake of illustration
    return Array.from({ length: yDim }, () => Array(hDim).fill(Math.random()));
}
