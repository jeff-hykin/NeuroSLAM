import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js"
import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"
import { mapToAsyncIterable } from "./utils/async.js"

// increments of 10 for testing
import uint8ArrayFor0001Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0010.png.binaryified.js"
import uint8ArrayFor0002Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0020.png.binaryified.js"
import uint8ArrayFor0003Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0030.png.binaryified.js"
import uint8ArrayFor0004Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0040.png.binaryified.js"
import uint8ArrayFor0005Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0050.png.binaryified.js"
import uint8ArrayFor0006Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0060.png.binaryified.js"
import uint8ArrayFor0007Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0070.png.binaryified.js"
import uint8ArrayFor0008Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0080.png.binaryified.js"
import uint8ArrayFor0009Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0090.png.binaryified.js"
import uint8ArrayFor0010Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0100.png.binaryified.js"



// 
// render
// 
    function toImgTag({pngData, ...props}) {
        // var pngData = new Uint8Array([
        //   137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 16,
        //   0, 0, 0, 16, 8, 6, 0, 0, 0, 55, 10, 51, 47, 0, 0, 0, 18, 73, 68, 65, 84,
        //   120, 94, 99, 96, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255
        // ]);
        // Convert Uint8Array to Blob
        const blob = new Blob([pngData], { type: 'image/png' })

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob)

        // Set the image source to the URL
        const img = document.createElement("img")
        img.src = url
        img.onload = () => {
            // Remove the temporary URL
            URL.revokeObjectURL(url)
        }
        // Return the image tag
        return passAlongProps(img, props)
    }

    function mainVisualImage({pngData, ...props}) {
        let img = toImgTag({pngData, style:'position: fixed; bottom: 0; left: 0; width: 100%; height: auto;'})
        return passAlongProps(img, props)
    }

    // add it to the local scope
    var { html } = Elemental({
        toImgTag,
        mainVisualImage,
    }) 

    // change some elements
    let imgElement, dataElement
    document.body = html`<body style="padding:1rem;">
        ${dataElement = html`<code style='background: darkgray; color: white; padding: 1rem; border-radius: 1rem; margin: 0.3rem; position: fixed; top: 0; left: 0; width: 15rem; max-height: 20rem; overflow: auto; white-space: pre;'></code>`}
        ${imgElement = html`<mainVisualImage pngData=${uint8ArrayFor0001Png} />`}
    </body>`

// 
// slam 
// 
    const frameData = [
        uint8ArrayFor0001Png,
        uint8ArrayFor0002Png,
        uint8ArrayFor0003Png,
        uint8ArrayFor0004Png,
        uint8ArrayFor0005Png,
        uint8ArrayFor0006Png,
        uint8ArrayFor0007Png,
        uint8ArrayFor0008Png,
        uint8ArrayFor0009Png,
        uint8ArrayFor0010Png,
    ]
    
    let frameIterator = mapToAsyncIterable(frameData, async (each)=>{
        // slow down rendering intentionally
        await new Promise(r=>setTimeout(r,1000))
        let newImageElement = mainVisualImage({pngData: each})
        // update the image
        imgElement.replaceWith(newImageElement)
        imgElement = newImageElement
        return each
    })
    
    import { visualOdoInitial } from "./03_visual_odometry/00_visual_odo_initial.js"
    import { visualOdoLoop } from "./03_visual_odometry/visual_odo_loop.js"
    var visualOdoGlobals = visualOdoInitial({
        ODO_IMG_TRANS_Y_RANGE: [51, 150],
        ODO_IMG_TRANS_X_RANGE: [181, 300],
        ODO_IMG_HEIGHT_V_Y_RANGE: [51, 150],
        ODO_IMG_HEIGHT_V_X_RANGE: [180, 300],
        ODO_IMG_YAW_ROT_Y_RANGE: [51, 150],
        ODO_IMG_YAW_ROT_X_RANGE: [180, 300],
        
        ODO_IMG_TRANS_RESIZE_RANGE: [100, 120], 
        ODO_IMG_YAW_ROT_RESIZE_RANGE: [100, 120], 
        ODO_IMG_HEIGHT_V_RESIZE_RANGE: [100, 120], 
        ODO_TRANS_V_SCALE: 1, 
        ODO_YAW_ROT_V_SCALE: 1, 
        ODO_HEIGHT_V_SCALE: 1, 
        MAX_TRANS_V_THRESHOLD: 0.02, 
        MAX_YAW_ROT_V_THRESHOLD: 10, 
        MAX_HEIGHT_V_THRESHOLD: 0.03,  
        ODO_SHIFT_MATCH_HORI: 36, 
        ODO_SHIFT_MATCH_VERT: 20, 
        FOV_HORI_DEGREE: 90, 
        FOV_VERT_DEGREE: 50, 
        KEY_POINT_SET: [1644, 1741], 
        ODO_STEP: 1
    })
    let frameIndex = 0
    for await (let { transV, yawRotV, heightV, ...other } of visualOdoLoop({frames: frameIterator, odoGlobals: visualOdoGlobals})) {
        frameIndex++

        // 
        dataElement.innerText = JSON.stringify({
            frameIndex,
            transV,
            yawRotV,
            heightV,
            // ...other
        }, null, 4)
    }