// import:
    // get_images_data_info(visualDataFile)
    // get_cur_img_files_path_list(subFoldersPathSet, IMG_TYPE, iSubFolder)
    // read_current_image(curFolderPath, imgFilesPathList, indFrame)
    // rgb2gray(curImg)
    // im2double(curGrayImg)
    // visual_odometry(curGrayImg)
    // visual_odometry_up(curGrayImg)
    // visual_odometry_down(curGrayImg)
    // visual_template(vtcurGrayImg, gcX, gcY, gcZ, curYawTheta, curHeight)
    // yaw_height_hdc_iteration(vt_id, yawRotV, heightV)
    // get_current_yaw_height_value()
    // gc_iteration(vt_id, transV, curYawThetaInRadian, heightV)
    // get_gc_xyz()
    // exp_map_iteration(vt_id, transV, yawRotV, heightV, gcX, gcY, gcZ, curYawTheta, curHeight)

const DEGREE_TO_RADIAN = Math.PI / 180
const RADIAN_TO_DEGREE = 180 / Math.PI
export function main({visualDataFile, groundTruthFile, expMapHistoryFile, odoMapHistoryFile, vtHistoryFile, emHistoryFile, gcTrajFile, hdcTrajFile}, input) {
    // Initializing variables
    const {
        BLOCK_READ,
        RENDER_RATE,
        GT_ODO_X_SCALING,
        GT_ODO_Y_SCALING,
        GT_ODO_Z_SCALING,
        GT_EXP_X_SCALING,
        GT_EXP_Y_SCALING,
        GT_EXP_Z_SCALING,
        ODO_MAP_X_SCALING,
        ODO_MAP_Y_SCALING,
        ODO_MAP_Z_SCALING,
        EXP_MAP_X_SCALING,
        EXP_MAP_Y_SCALING,
        EXP_MAP_Z_SCALING,
    } = input

    // Global Variables Setup
    const mainGlobals = {
        PREV_VT_ID: null,
        SUB_VT_IMG: null,
        VT_HISTORY: null,
        IMG_TYPE: null,
        VT_STEP: null,
        SUB_HORI_TRANS_IMG: null,
        SUB_ROT_IMG: null,
        SUB_VERT_TRANS_IMG: null,
        SUB_PITCH_IMG: null,
        KEY_POINT_SET: null,
        ODO_STEP: null,
        YAW_HEIGHT_HDC: null,
        YAW_HEIGHT_HDC_Y_DIM: null,
        YAW_HEIGHT_HDC_H_DIM: null,
        YAW_HEIGHT_HDC_Y_TH_SIZE: null,
        MAX_ACTIVE_YAW_HEIGHT_HIS_PATH: null,
        GRIDCELLS: null,
        GC_X_DIM: null,
        GC_Y_DIM: null,
        GC_Z_DIM: null,
        MAX_ACTIVE_XYZ_PATH: null,
        EXPERIENCES: null,
        EXP_HISTORY: null,
        NUM_EXPS: null,
        EXP_CORRECTION: null,
        EXP_LOOPS: null,
        EXP_NODES_LINKS: { nodes: [1], numlinks: [0], linknodes: [[0]] },
    }

    // Initialization of other variables
    let curYawTheta = 1,
        curHeight = 1
    let gcX, gcY, gcZ
    let gtHasValue = 0
    let startFrame = 1,
        endFrame = 956,
        curFrame = 0
    let vtcurFrame = 1,
        preImg = 0

    let expTrajectory = [[0, 0, 0, 0]]
    let odoMapTrajectory = [[0, 0, 0, 0]]
    let hdcYawTheta = [[0, 0, 0]]

    // let groundTruthData = []
    // if (groundTruthFile) {
    //     // Assuming load_ground_truth_data is a function that returns data in an array format
    //     groundTruthData = load_ground_truth_data(groundTruthFile)
    //     gtHasValue = 1
    // }

    // Fetch image data info
    const [subFoldersPathSet, numSubFolders] = get_images_data_info(visualDataFile)

    // Processing
    for (let iSubFolder = 0; iSubFolder < numSubFolders; iSubFolder++) {
        const [curFolderPath, imgFilesPathList, numImgs] = get_cur_img_files_path_list(subFoldersPathSet, IMG_TYPE, iSubFolder)

        if (numImgs > 0) {
            for (let indFrame = startFrame; indFrame < numImgs; indFrame += ODO_STEP) {
                const curImg = read_current_image(curFolderPath, imgFilesPathList, indFrame)
                const curGrayImg = rgb2gray(curImg)
                const curGrayImgDouble = im2double(curGrayImg)

                let transV, yawRotV, heightV

                // Odometry processing
                if (KEY_POINT_SET.length === 2) {
                    if (indFrame < KEY_POINT_SET[0]) {
                        ;[transV, yawRotV, heightV] = visual_odometry(curGrayImgDouble)
                    } else if (indFrame < KEY_POINT_SET[1]) {
                        ;[transV, yawRotV, heightV] = visual_odometry_up(curGrayImgDouble)
                    } else {
                        ;[transV, yawRotV, heightV] = visual_odometry(curGrayImgDouble)
                    }
                    transV = 2
                } else {
                    if (indFrame < KEY_POINT_SET[0]) {
                        ;[transV, yawRotV, heightV] = visual_odometry(curGrayImgDouble)
                    } else if (indFrame < KEY_POINT_SET[1]) {
                        ;[transV, yawRotV, heightV] = visual_odometry_up(curGrayImgDouble)
                    } else if (indFrame < KEY_POINT_SET[2]) {
                        ;[transV, yawRotV, heightV] = visual_odometry(curGrayImgDouble)
                    } else if (indFrame < KEY_POINT_SET[3]) {
                        ;[transV, yawRotV, heightV] = visual_odometry_down(curGrayImgDouble)
                    } else {
                        ;[transV, yawRotV, heightV] = visual_odometry(curGrayImgDouble)
                    }
                }

                yawRotV *= DEGREE_TO_RADIAN // Convert to radians

                // Visual template processing
                let vt_id
                if (VT_STEP === 1) {
                    vtcurGrayImg = curGrayImgDouble
                } else {
                    if (curFrame % VT_STEP === 1) {
                        vtcurGrayImg = curGrayImgDouble
                        preImg = vtcurGrayImg
                    } else {
                        vtcurGrayImg = preImg
                    }
                }

                vt_id = visual_template(vtcurGrayImg, gcX, gcY, gcZ, curYawTheta, curHeight)

                // yaw_height_hdc iteration
                yaw_height_hdc_iteration(vt_id, yawRotV, heightV)
                ;[curYawTheta, curHeight] = get_current_yaw_height_value()

                const curYawThetaInRadian = curYawTheta * YAW_HEIGHT_HDC_Y_TH_SIZE
                MAX_ACTIVE_YAW_HEIGHT_HIS_PATH.push([curYawTheta, curHeight])

                // 3D grid cells interaction
                gc_iteration(vt_id, transV, curYawThetaInRadian, heightV)
                ;[gcX, gcY, gcZ] = get_gc_xyz()
                MAX_ACTIVE_XYZ_PATH.push([gcX, gcY, gcZ])

                // Experience map iteration
                exp_map_iteration(vt_id, transV, yawRotV, heightV, gcX, gcY, gcZ, curYawTheta, curHeight)

                // Update odometry trajectory
                odoYawTheta.push([Math.cos(odoYawTheta[curFrame][2] + yawRotV), Math.sin(odoYawTheta[curFrame][2] + yawRotV), odoYawTheta[curFrame][2] + yawRotV])

                odoMapTrajectory.push([odoMapTrajectory[curFrame][0] + transV * Math.cos(odoYawTheta[curFrame][2] + yawRotV), odoMapTrajectory[curFrame][1] + transV * Math.sin(odoYawTheta[curFrame][2] + yawRotV), odoMapTrajectory[curFrame][2] + heightV, odoYawTheta[curFrame + 1][2]])

                // HDC yaw theta update
                hdcYawTheta.push([Math.cos(curYawTheta * YAW_HEIGHT_HDC_Y_TH_SIZE), Math.sin(curYawTheta * YAW_HEIGHT_HDC_Y_TH_SIZE), curYawTheta * YAW_HEIGHT_HDC_Y_TH_SIZE])

                // Experience trajectory update
                EXPERIENCES.forEach((exp, ind) => {
                    expTrajectory[ind] = [exp.x_exp, exp.y_exp, exp.z_exp, exp.yaw_exp_rad]
                })

                // Update nodes and links for experiences
                EXP_NODES_LINKS.nodes.forEach((_, ind_exps) => {
                    EXP_NODES_LINKS.numlinks[ind_exps] = EXPERIENCES[ind_exps].numlinks
                    for (let link_id = 0; link_id < EXPERIENCES[ind_exps].numlinks; link_id++) {
                        EXP_NODES_LINKS.linknodes[ind_exps][link_id] = EXPERIENCES[ind_exps].links[link_id].exp_id
                    }
                })

                // plots, example in js plotly
                    // <div id="gridCellPlot" style="width: 100%; height: 400px;"></div>
                    // <div id="yawHDCPlot" style="width: 100%; height: 400px;"></div>
                    // <div id="expMapPlot" style="width: 100%; height: 400px;"></div>
                    // <div id="yawImagePlot" style="width: 100%; height: 400px;"></div>

                    // Sample Data (you would replace this with your actual data)
                    // const gridCellEdges = [
                    //     { x: [0, 0], y: [0, 0], z: [0, 36] },
                    //     { x: [0, 0], y: [0, 36], z: [0, 0] },
                    //     { x: [0, 36], y: [0, 0], z: [0, 0] },
                    //     { x: [0, 36], y: [36, 36], z: [0, 0] },
                    //     { x: [0, 0], y: [36, 36], z: [0, 36] },
                    //     { x: [36, 36], y: [0, 36], z: [0, 0] },
                    //     { x: [36, 36], y: [0, 0], z: [0, 36] },
                    //     { x: [0, 0], y: [0, 36], z: [36, 36] },
                    //     { x: [0, 36], y: [0, 0], z: [36, 36] },
                    //     { x: [0, 36], y: [36, 36], z: [36, 36] },
                    //     { x: [36, 36], y: [0, 36], z: [36, 36] },
                    //     { x: [36, 36], y: [36, 36], z: [0, 36] }
                    // ];

                    // Example surface data (replace with actual YAW_HEIGHT_HDC)
                    // const X = [...Array(36).keys()].map((x) => x + 1)
                    // const Y = [...Array(36).keys()].map((x) => x + 1)
                    // const Z = new Array(36).fill(0).map(() => new Array(36).fill(Math.random())) // Random surface

                    // // Example 3D Experience map (replace with actual trajectory)
                    // const expTrajectory = Array.from({ length: 100 }, (_, i) => ({
                    //     x: i * Math.random(),
                    //     y: i * Math.random(),
                    //     z: i * Math.random(),
                    // }))

                    // // Yaw Image Data (you would load this image dynamically)
                    // const yawImage = new Array(36).fill(0).map(() => new Array(36).fill(Math.random())) // Placeholder for image

                    // // Create Grid Cell Activity 3D plot
                    // const gridCellData = gridCellEdges.map((edge, idx) => ({
                    //     x: edge.x,
                    //     y: edge.y,
                    //     z: edge.z,
                    //     mode: "lines",
                    //     line: { color: "black", width: 2 },
                    //     type: "scatter3d",
                    //     name: `Edge ${idx + 1}`,
                    // }))

                    // const gridCellLayout = {
                    //     title: "3D Grid Cell Activity",
                    //     scene: {
                    //         xaxis: { title: "X" },
                    //         yaxis: { title: "Y" },
                    //         zaxis: { title: "Z" },
                    //     },
                    // }

                    // // Create Yaw-Height HDC Surface plot
                    // const yawHDCPlot = {
                    //     type: "surface",
                    //     x: X,
                    //     y: Y,
                    //     z: Z,
                    //     colorscale: "Blues",
                    //     opacity: 0.5,
                    //     colorbar: {
                    //         title: "Activity",
                    //     },
                    // }

                    // const yawHDCLayout = {
                    //     title: "Yaw-Height HDC",
                    //     scene: {
                    //         xaxis: { title: "Yaw" },
                    //         yaxis: { title: "Height" },
                    //         zaxis: { title: "Activity" },
                    //     },
                    // }

                    // // Create Experience Map 3D scatter plot
                    // const expMapData = {
                    //     x: expTrajectory.map((t) => t.x),
                    //     y: expTrajectory.map((t) => t.y),
                    //     z: expTrajectory.map((t) => t.z),
                    //     mode: "markers",
                    //     marker: { size: 6, color: "blue" },
                    //     type: "scatter3d",
                    //     name: "Experience Map",
                    // }

                    // const expMapLayout = {
                    //     title: "Experience Map",
                    //     scene: {
                    //         xaxis: { title: "X" },
                    //         yaxis: { title: "Y" },
                    //         zaxis: { title: "Z" },
                    //     },
                    // }

                    // // Create Yaw Image plot
                    // const yawImagePlotData = {
                    //     z: yawImage,
                    //     type: "heatmap",
                    //     colorscale: "Greys",
                    // }

                    // const yawImageLayout = {
                    //     title: "Yaw Image for VO and VT",
                    //     xaxis: { title: "Width" },
                    //     yaxis: { title: "Height" },
                    // }

                    // // Plot Grid Cell Activity
                    // Plotly.newPlot("gridCellPlot", gridCellData, gridCellLayout)

                    // // Plot Yaw-Height HDC
                    // Plotly.newPlot("yawHDCPlot", [yawHDCPlot], yawHDCLayout)

                    // // Plot Experience Map
                    // Plotly.newPlot("expMapPlot", [expMapData], expMapLayout)

                    // // Plot Yaw Image
                    // Plotly.newPlot("yawImagePlot", [yawImagePlotData], yawImageLayout)
                
                // plots, example in python plotly
                    // import plotly.graph_objects as go
                    // from plotly.subplots import make_subplots
                    // import numpy as np

                    // # Assuming you have the necessary data from MATLAB code in Python equivalents
                    // # For example, variables like EXP_NODES_LINKS, GRIDCELLS, YAW_HEIGHT_HDC, etc.

                    // # Create a 3x3 subplot grid
                    // fig = make_subplots(
                    //     rows=3, cols=3,
                    //     specs=[[{'type': 'scatter3d'}, {'type': 'surface'}, {'type': 'scatter3d'}],
                    //            [{'type': 'scatter3d'}, {'type': 'scatter'}, {'type': 'scatter3d'}],
                    //            [{'type': 'scatter'}, {'type': 'scatter'}, {'type': 'scatter3d'}]],
                    //     subplot_titles=('3D Grid Cell Activity', 'Yaw-Height HDC', 'Experience Map', 'Yaw for VO and VT', 'History of Experiences', 'Visual Template History')
                    // )

                    // # 3D Grid Cell Activity
                    // # Create edges similar to the MATLAB code for drawing the grid edges
                    // edges = [
                    //     {'x': [0, 0], 'y': [0, 0], 'z': [0, 36]}, # edge1
                    //     {'x': [0, 0], 'y': [0, 36], 'z': [0, 0]}, # edge2
                    //     {'x': [0, 36], 'y': [0, 0], 'z': [0, 0]}, # edge3
                    //     {'x': [0, 36], 'y': [36, 36], 'z': [0, 0]}, # edge4
                    //     {'x': [0, 0], 'y': [36, 36], 'z': [0, 36]}, # edge5
                    //     {'x': [36, 36], 'y': [0, 36], 'z': [0, 0]}, # edge6
                    //     {'x': [36, 36], 'y': [0, 0], 'z': [0, 36]}, # edge7
                    //     {'x': [0, 0], 'y': [0, 36], 'z': [36, 36]}, # edge8
                    //     {'x': [0, 36], 'y': [0, 0], 'z': [36, 36]}, # edge9
                    //     {'x': [0, 36], 'y': [36, 36], 'z': [36, 36]}, # edge10
                    //     {'x': [36, 36], 'y': [0, 36], 'z': [36, 36]}, # edge11
                    //     {'x': [36, 36], 'y': [36, 36], 'z': [0, 36]}  # edge12
                    // ]

                    // for edge in edges:
                    //     fig.add_trace(go.Scatter3d(
                    //         x=edge['x'], y=edge['y'], z=edge['z'],
                    //         mode='lines', line=dict(color='black', width=2),
                    //         name='Grid Cell Edges'
                    //     ), row=1, col=1)

                    // # Yaw-Height HDC Surface Plot
                    // x = np.arange(1, 37)  # Adjust size for meshgrid
                    // y = np.arange(1, 37)
                    // X, Y = np.meshgrid(x, y)
                    // Z = YAW_HEIGHT_HDC  # Assuming YAW_HEIGHT_HDC is the data you want to plot

                    // fig.add_trace(go.Surface(
                    //     z=Z, x=X, y=Y, colorscale='Blues', opacity=0.5,
                    //     colorbar=dict(title='Activity')
                    // ), row=1, col=2)

                    // # Experience Map (3D scatter plot)
                    // fig.add_trace(go.Scatter3d(
                    //     x=expTrajectory[:, 1] * EXP_MAP_X_SCALING,
                    //     y=expTrajectory[:, 0] * EXP_MAP_Y_SCALING,
                    //     z=expTrajectory[:, 2] * EXP_MAP_Z_SCALING,
                    //     mode='markers', marker=dict(size=6, color='blue'),
                    //     name='Experience Map'
                    // ), row=2, col=1)

                    // # History of Experiences
                    // fig.add_trace(go.Scatter(
                    //     x=np.arange(len(EXP_HISTORY)),
                    //     y=EXP_HISTORY,
                    //     mode='markers', marker=dict(size=6, color='green'),
                    //     name='Experience History'
                    // ), row=3, col=1)

                    // # Visual Template History
                    // fig.add_trace(go.Scatter(
                    //     x=np.arange(len(VT_HISTORY)),
                    //     y=VT_HISTORY,
                    //     mode='markers', marker=dict(size=6, color='red'),
                    //     name='Visual Template History'
                    // ), row=3, col=2)

                    // # Plot current yaw image (you may want to use a heatmap or image trace here)
                    // fig.add_trace(go.Image(
                    //     z=curImg,
                    //     colorscale='Gray',
                    //     name='Yaw Image'
                    // ), row=2, col=2)

                    // # Yaw Polar Plot
                    // theta = np.linspace(0, 2*np.pi, 100)
                    // rho = np.sin(theta)  # Assuming theta and rho come from the decoded yaw
                    // fig.add_trace(go.Scatterpolar(
                    //     r=rho, theta=theta, mode='lines', name='Yaw',
                    //     line=dict(color='red')
                    // ), row=1, col=3)

                    // # Layout Adjustments
                    // fig.update_layout(
                    //     title='Activity and Map Visualizations',
                    //     height=1000, width=1200,
                    //     showlegend=False,
                    //     scene=dict(
                    //         xaxis=dict(title='x', tickvals=np.arange(0, 37, 9)),
                    //         yaxis=dict(title='y', tickvals=np.arange(0, 37, 18)),
                    //         zaxis=dict(title='z', tickvals=np.arange(0, 37, 9))
                    //     ),
                    //     scene2=dict(
                    //         xaxis_title="Height",
                    //         yaxis_title="Yaw",
                    //         zaxis_title="Activity"
                    //     ),
                    //     scene3=dict(
                    //         xaxis_title="exp-x",
                    //         yaxis_title="exp-y",
                    //         zaxis_title="exp-z"
                    //     ),
                    // )

                    // # Show plot
                    // fig.show()
                
                PREV_VT_ID = vt_id
                curFrame++
            }
        }
    }
}
