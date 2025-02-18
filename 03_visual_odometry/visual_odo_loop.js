import { parseCsv } from "../imports.js"
import { pathPureName } from "../imports.js"

import { visualOdometry } from "./02_visual_odometry.js"
import { decode } from "../utils/png.js"
import { toGrayscaleMagnitude } from "../utils/image.js"

// Define the constants
const DEGREE_TO_RADIAN = Math.PI / 180
const RADIAN_TO_DEGREE = 180 / Math.PI

export async function *visualOdoLoop({frames, groundTruthFile, odoGlobals}) {
    // Getting the visual data information

    const { RENDER_RATE } = { RENDER_RATE: 2, ...odoGlobals }
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
    let curFrame = -1
    for await (const frame of frames) {
        curFrame += 1
        
        // Read current image, convert to grayscale, and convert to magnitude
        let curGrayImg = toGrayscaleMagnitude(
            decode(
                frame
            ),
        )
        // console.log(`curGrayImg`, curGrayImg)
        let preProfilesTransImg = odoGlobals.PREV_TRANS_V_IMG_X_SUMS
        let preProfilesYawRotImg = odoGlobals.PREV_YAW_ROT_V_IMG_X_SUMS
        let preProfilesHeightVImg = odoGlobals.PREV_HEIGHT_V_IMG_Y_SUMS
        
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
        console.debug(`sideEffects.PREV_TRANS_V is:`,sideEffects.PREV_TRANS_V)

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
            // console.log("Rendering frame", curFrame)
            
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
            let profilesTransImg = normalizeProfileHorizontal(odoGlobals.SUB_TRANS_IMG) // Horizontal translational profile
            let profilesYawRotImg = normalizeProfileRotational(odoGlobals.SUB_YAW_ROT_IMG) // Rotational profile
            let profilesHeightVImg = normalizeProfileVertical(odoGlobals.SUB_HEIGHT_V_IMG) // Vertical translational profile

            // Compute differences between current and previous profiles (if applicable)
            let diffYawRotImgs = profilesYawRotImg.map((value, idx) => value - preProfilesYawRotImg[idx])
            let diffHeightVImgs = profilesHeightVImg.map((value, idx) => value - preProfilesHeightVImg[idx])
            
            yield {
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
            }
            // 
            // plots
            // 
                // from Jeff:
                    // GPT translation as a starting point: (trying to use plotly.js)
                    // I'm pretty sure all this is supposed to be for live updating data, which I don't think is going to work with plotly.js
                    // also GPT didn't init a lot of vars like:
                        // theta = [0 0 0 0 0 0];
                        // rho = [0 0 0 0 0 0];
                        // startPoint =[0 0];
                        // endPoint = [0.8 0.8];
                    // to be fair, they were never updated or used in calcuations 

                // // First figure with subplots
                // var trace1 = {
                //     z: odoGlobals.SUB_TRANS_IMG, 
                //     type: 'heatmap',
                //     colorscale: 'Viridis',
                //     colorbar: { title: 'Intensity' }
                // };

                // var trace2 = {
                //     x: Array.from({length: profilesTransImg.length}, (_, i) => i + 1),
                //     y: profilesTransImg,
                //     mode: 'lines',
                //     line: { color: 'red' },
                //     name: 'Current Profile'
                // };

                // var trace3 = {
                //     x: Array.from({length: preProfilesTransImg.length}, (_, i) => i + 1),
                //     y: preProfilesTransImg,
                //     mode: 'lines',
                //     line: { color: 'green' },
                //     name: 'Previous Profile'
                // };

                // var trace4 = {
                //     x: Array.from({length: transVelVector.length}, (_, i) => i + 1),
                //     y: transVelVector,
                //     mode: 'lines',
                //     name: 'Translational Velocity'
                // };

                // var trace5 = {
                //     z: odoGlobals.SUB_YAW_ROT_IMG, 
                //     type: 'heatmap',
                //     colorscale: 'Viridis',
                //     colorbar: { title: 'Intensity' }
                // };

                // var trace6 = {
                //     x: Array.from({length: profilesYawRotImg.length}, (_, i) => i + 1),
                //     y: profilesYawRotImg,
                //     mode: 'lines',
                //     line: { color: 'red' },
                //     name: 'Current Profile'
                // };

                // var trace7 = {
                //     x: Array.from({length: preProfilesYawRotImg.length}, (_, i) => i + 1),
                //     y: preProfilesYawRotImg,
                //     mode: 'lines',
                //     line: { color: 'green' },
                //     name: 'Previous Profile'
                // };

                // var trace8 = {
                //     x: Array.from({length: subRotVel.length}, (_, i) => i + 1),
                //     y: subRotVel,
                //     mode: 'lines',
                //     name: 'Yaw Rotational Velocity'
                // };
                console.debug(`subRotVel is:`,subRotVel)

                // var trace9 = {
                //     z: odoGlobals.SUB_HEIGHT_V_IMG, 
                //     type: 'heatmap',
                //     colorscale: 'Viridis',
                //     colorbar: { title: 'Intensity' }
                // };

                // var trace10 = {
                //     x: profilesHeightVImg,
                //     y: Array.from({length: profilesHeightVImg.length}, (_, i) => i + 1),
                //     mode: 'lines',
                //     line: { color: 'red' },
                //     name: 'Current Profile'
                // };

                // var trace11 = {
                //     x: preProfilesHeightVImg,
                //     y: Array.from({length: preProfilesHeightVImg.length}, (_, i) => i + 1),
                //     mode: 'lines',
                //     line: { color: 'green' },
                //     name: 'Previous Profile'
                // };

                // var trace12 = {
                //     x: Array.from({length: heightVelVector.length}, (_, i) => i + 1),
                //     y: heightVelVector,
                //     mode: 'lines',
                //     name: 'Vertical Translational Velocity'
                // };

                // var trace13 = {
                //     r: rho,
                //     theta: theta,
                //     mode: 'lines+markers',
                //     name: 'Current Rotational Direction'
                // };

                // var trace14 = {
                //     x: Array.from({length: sumHeight.length}, (_, i) => i + 1),
                //     y: sumHeight,
                //     mode: 'lines',
                //     name: 'Height Change'
                // };

                // var trace15 = {
                //     x: Array.from({length: offsetYawRotVector.length}, (_, i) => i + 1),
                //     y: offsetYawRotVector,
                //     mode: 'lines',
                //     line: { color: 'red' },
                //     name: 'Offset Yaw Rotation'
                // };

                // var trace16 = {
                //     x: Array.from({length: offsetHeightVVector.length}, (_, i) => i + 1),
                //     y: offsetHeightVVector,
                //     mode: 'lines',
                //     line: { color: 'green' },
                //     name: 'Offset Height V'
                // };

                // // Subplot data for figure 1
                // var layout1 = {
                //     grid: { rows: 3, columns: 4, pattern: 'independent' },
                //     title: 'Subplots for Image and Profiles',
                //     xaxis: { title: 'Width' },
                //     yaxis: { title: 'Height' },
                // };

                // var fig1 = {
                //     data: [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8, trace9, trace10, trace11, trace12, trace13, trace14, trace15, trace16],
                //     layout: layout1
                // };

                // // Create the figure 1
                // Plotly.newPlot('figure1', fig1);

                // // Second figure with 3D plot
                // var trace17 = {
                //     x: odoMapTrajectory.map(t => t[1] * ODO_MAP_X_SCALING),
                //     y: odoMapTrajectory.map(t => t[0] * ODO_MAP_Y_SCALING),
                //     z: odoMapTrajectory.map(t => t[2] * ODO_MAP_Z_SCALING),
                //     mode: 'markers',
                //     marker: { color: 'blue' },
                //     name: 'Odometry Map'
                // };

                // var trace18 = {
                //     x: odoMapTrajectory.map(t => t[1] * ODO_MAP_X_SCALING),
                //     y: odoMapTrajectory.map(t => t[0] * ODO_MAP_Y_SCALING),
                //     z: odoMapTrajectory.map(t => t[2] * ODO_MAP_Z_SCALING),
                //     mode: 'markers',
                //     marker: { color: 'blue' },
                //     name: 'Odometry Map (Top View)'
                // };

                // var layout2 = {
                //     scene: {
                //         xaxis: { title: 'odo-map-x' },
                //         yaxis: { title: 'odo-map-y' },
                //         zaxis: { title: 'odo-map-z' }
                //     },
                //     title: 'Multilayered Odometry Map',
                //     showlegend: true
                // };

                // var fig2 = {
                //     data: [trace17, trace18],
                //     layout: layout2
                // };

                // // Create the figure 2
                // Plotly.newPlot('figure2', fig2);
        }
    }
}
