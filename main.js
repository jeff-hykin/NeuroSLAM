import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js"
import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"
import { mapToAsyncIterable } from "./utils/async.js"
import { synpan } from "./neo/ground_truth.js"
import { newRgbImageEvent } from "./neo/rgb_image/event.js"
import { newGrayscaleImageEvent } from "./neo/grayscale_image/event.js"
import { newVisualOdomEvent } from "./neo/visual_odom/event.js"
import { everyTime, everyTimeAllLatestOf, once } from "./utils/event_manager.js"

// have them all listen to each other
import "./neo/rgb_image/node.js"
import "./neo/grayscale_image/node.js"
import "./neo/visual_odom/node.js"

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
        ${imgElement = html`<mainVisualImage />`}
    </body>`

// 
// events
// 
    // render rgb's
    everyTime(newRgbImageEvent).then(({frame, frameRealIndex, ...other})=>{
        let newImageElement = mainVisualImage({pngData: frame})
        // update the image
        imgElement.replaceWith(newImageElement)
        imgElement = newImageElement
    })
    
    // render data
    everyTime(newVisualOdomEvent).then(({transV, yawRotV, heightV, frameRealIndex, ...other})=>{
        dataElement.innerText = JSON.stringify({
            transV,
            yawRotV,
            heightV,
            groundTruth: synpan[frameRealIndex],
        }, null, 4)
    })