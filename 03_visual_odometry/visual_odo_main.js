import { FileSystem } from "../imports.js"
import { parseCsv } from "../imports.js"

import { visualOdometry } from "./visual_odometry.js"
import { pathPureName } from "https://deno.land/x/good@1.14.3.0/flattened/path_pure_name.js"

// Define the constants
const DEGREE_TO_RADIAN = Math.PI / 180
const RADIAN_TO_DEGREE = 180 / Math.PI

// TODO: missing things:
    // function imread(path) {
    //     // This function should load an image from the path and return the image data.
    //     // Use a library like opencv.js or any suitable API to load and process images.
    //     return new Image(); // Placeholder
    // }

    // function rgb2gray(image) {
    //     // Convert the image to grayscale
    //     // For simplicity, we assume the image is in RGB format.
    //     // Implement the RGB to grayscale conversion.
    //     return image; // Placeholder
    // }

    // function im2double(image) {
    //     // Normalize the image to [0, 1]
    //     return image; // Placeholder
    // }

export function visualOdoMain(visualDataFile, groundTruthFile, odoGlobals) {
    // Getting the visual data information
    const paths = FileSystem.sync.listFolderPathsIn(visualDataFile)

    const { RENDER_RATE } = { RENDER_RATE: 2, ...odoGlobals }
    let curFrame = 0
    let startFrame = 1 // not sure why 
    // Load ground truth data if provided
    // for some reason this isn't ever used, so I'm commenting it out --Jeff
    // let groundTruthData = []
    // if (groundTruthFile) {
    //     const [frameId, gt_x, gt_y, gt_z, gt_rx, gt_ry, gt_rz] = parseCsv(groundTruthFile)
    //     groundTruthData = [gt_x, gt_y, gt_z]
    // }

    // Initializing variables for previous profiles
    let preProfilesTransImg = Array(odoGlobals.ODO_IMG_TRANS_RESIZE_RANGE[1]).fill(0)
    let preProfilesYawRotImg = Array(odoGlobals.ODO_IMG_YAW_ROT_RESIZE_RANGE[1]).fill(0)
    let preProfilesPitchRotImg = Array(odoGlobals.ODO_IMG_HEIGHT_V_RESIZE_RANGE[1]).fill(0)

    let curRotDir = [0, 0, 0] // Current rotational direction
    let sumRotAngle = 0

    let subRotVel = []
    let transVelVector = []
    let heightVelVector = []
    let sumHeight = [0]
    let offsetYawRotVector = [0]
    let offsetHeightVVector = [0]

    let odoMapTrajectory = [[0, 0, 0, 0]]
    var sideEffects = { ...odoGlobals }

    // Processing visual odometry
    for (let eachPath of paths) {
        // Get all image files in the current subfolder
        let filePaths = FileSystem.sync.listPathsIn(eachPath)
        let imgFilesPathList = filePaths.filter((each) => each.endsWith(".png"))
        // sort by frame number
        imgFilesPathList.sort((a,b) =>{
            a = pathPureName(a)-0
            b = pathPureName(b)-0
            return a-b
        })
        const numImgs = imgFilesPathList.length
        const indexToImagePath = Object.fromEntries(imgFilesPathList.map(
            eachPath => [
                // key
                pathPureName(eachPath),
                // value
                eachPath
            ]
        ))

        if (numImgs > 0) {
            for (let indexFrame = startFrame; indexFrame < numImgs - 1; indexFrame += odoGlobals.ODO_STEP) {
                curFrame += 1

                // Read current image
                let curImg = imread(indexToImagePath[indexFrame])
                let curGrayImg = rgb2gray(curImg)
                curGrayImg = im2double(curGrayImg) // 0 to 1 for each pixel

                // Simulating visual odometry (transV, yawRotV, heightV)
                var { transV, yawRotV, heightV, sideEffects } = visualOdometry(curGrayImg, odoGlobals)
                // showing what gets changed (sometimes) by visualOdometry
                Object.assign(odoGlobals, {
                    SUB_YAW_ROT_IMG: sideEffects.SUB_YAW_ROT_IMG,
                    SUB_TRANS_IMG: sideEffects.SUB_TRANS_IMG,
                    OFFSET_YAW_ROT: sideEffects.OFFSET_YAW_ROT,
                    PREV_YAW_ROT_V: sideEffects.PREV_YAW_ROT_V,
                    PREV_YAW_ROT_V_IMG_X_SUMS: sideEffects.PREV_YAW_ROT_V_IMG_X_SUMS,
                    PREV_TRANS_V_IMG_X_SUMS: sideEffects.PREV_TRANS_V_IMG_X_SUMS,
                    PREV_TRANS_V: sideEffects.PREV_TRANS_V,
                    SUB_HEIGHT_V_IMG: sideEffects.SUB_HEIGHT_V_IMG,
                    OFFSET_HEIGHT_V: sideEffects.OFFSET_HEIGHT_V,
                    PREV_HEIGHT_V: sideEffects.PREV_HEIGHT_V,
                    PREV_HEIGHT_V_IMG_Y_SUMS: sideEffects.PREV_HEIGHT_V_IMG_Y_SUMS,
                })

                subRotVel[curFrame] = yawRotV
                transVelVector[curFrame] = transV
                heightVelVector[curFrame] = heightV

                offsetYawRotVector[curFrame] = 0 // Placeholder for the offset
                offsetHeightVVector[curFrame] = 0

                sumHeight[curFrame + 1] = sumHeight[curFrame] + heightV

                // Updating rotational angle
                if (sumRotAngle + yawRotV >= 360) {
                    sumRotAngle = (sumRotAngle + yawRotV) % 360
                } else if (sumRotAngle + yawRotV <= -360) {
                    sumRotAngle = sumRotAngle + yawRotV + 360
                } else {
                    sumRotAngle = sumRotAngle + yawRotV
                }

                // Direction update
                yawRotV = yawRotV * DEGREE_TO_RADIAN
                curRotDir[curFrame + 1] = [Math.cos(curRotDir[curFrame][2] + yawRotV), Math.sin(curRotDir[curFrame][2] + yawRotV), curRotDir[curFrame][2] + yawRotV]

                odoMapTrajectory[curFrame + 1] = [odoMapTrajectory[curFrame][0] + transV * Math.cos(curRotDir[curFrame + 1][2]), odoMapTrajectory[curFrame][1] + transV * Math.sin(curRotDir[curFrame + 1][2]), odoMapTrajectory[curFrame][2] + heightV, curRotDir[curFrame + 1][2]]

                if (curFrame % RENDER_RATE === 0) {
                    // Placeholder for plot rendering
                    // Use libraries such as plotly.js or three.js to plot the graphs and 3D maps
                    console.log("Rendering frame", curFrame)
                    // Assuming SUB_TRANS_IMG, SUB_YAW_ROT_IMG, and SUB_HEIGHT_V_IMG are 2D arrays (matrices) that you've already loaded

                    // Function to compute the normalized profile of horizontal translational image
                    function normalizeProfileHorizontal(imgMatrix) {
                        let profilesTransImg = imgMatrix.reduce((acc, row) => acc.map((sum, idx) => sum + row[idx]), Array(imgMatrix[0].length).fill(0))
                        let avgIntensity = profilesTransImg.reduce((sum, value) => sum + value, 0) / profilesTransImg.length
                        return profilesTransImg.map((value) => value / avgIntensity) // Normalize the profile
                    }

                    // Function to compute the normalized profile of rotational image
                    function normalizeProfileRotational(imgMatrix) {
                        let profilesYawRotImg = imgMatrix.reduce((acc, row) => acc.map((sum, idx) => sum + row[idx]), Array(imgMatrix[0].length).fill(0))
                        let avgIntensity = profilesYawRotImg.reduce((sum, value) => sum + value, 0) / profilesYawRotImg.length
                        return profilesYawRotImg.map((value) => value / avgIntensity) // Normalize the profile
                    }

                    // Function to compute the normalized profile of vertical translational image
                    function normalizeProfileVertical(imgMatrix) {
                        let profilesHeightVImg = imgMatrix.reduce((acc, row) => acc.map((sum, idx) => sum + row[idx]), Array(imgMatrix.length).fill(0))
                        let avgIntensity = profilesHeightVImg.reduce((sum, value) => sum + value, 0) / profilesHeightVImg.length
                        return profilesHeightVImg.map((value) => value / avgIntensity) // Normalize the profile
                    }

                    // Example use for computing normalized profiles
                    let profilesTransImg = normalizeProfileHorizontal(odoGlobals.SUB_TRANS_IMG) // Horizontal translational profile
                    let profilesYawRotImg = normalizeProfileRotational(odoGlobals.SUB_YAW_ROT_IMG) // Rotational profile
                    let profilesHeightVImg = normalizeProfileVertical(odoGlobals.SUB_HEIGHT_V_IMG) // Vertical translational profile

                    // Compute differences between current and previous profiles (if applicable)
                    let diffYawRotImgs = profilesYawRotImg.map((value, idx) => value - preProfilesYawRotImg[idx])
                    let diffHeightVImgs = profilesHeightVImg.map((value, idx) => value - preProfilesHeightVImg[idx])
                }
            }
        }
    }
}
