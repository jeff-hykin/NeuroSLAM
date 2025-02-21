import { Event, trigger, everyTime, everyTimeAllLatestOf, once } from "../../utils/event_manager.js"
import { newRgbImageEvent } from "./event.js"

// import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.3.1/source/csv.js"
import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@34eba35/source/csv.js"

// increments of 10 for testing
import uint8ArrayFor0001Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0071.png.binaryified.js"
import uint8ArrayFor0002Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0072.png.binaryified.js"
import uint8ArrayFor0003Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0073.png.binaryified.js"
import uint8ArrayFor0004Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0074.png.binaryified.js"
import uint8ArrayFor0005Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0075.png.binaryified.js"
import uint8ArrayFor0006Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0076.png.binaryified.js"
import uint8ArrayFor0007Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0077.png.binaryified.js"
import uint8ArrayFor0008Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0078.png.binaryified.js"
import uint8ArrayFor0009Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0079.png.binaryified.js"
import uint8ArrayFor0010Png from "./01_NeuroSLAM_Datasets.ignore/02_SynPanData/0080.png.binaryified.js"

const frameData = [
    {frame: uint8ArrayFor0001Png, frameRealIndex: 71, },
    {frame: uint8ArrayFor0002Png, frameRealIndex: 72, },
    {frame: uint8ArrayFor0003Png, frameRealIndex: 73, },
    {frame: uint8ArrayFor0004Png, frameRealIndex: 74, },
    {frame: uint8ArrayFor0005Png, frameRealIndex: 75, },
    {frame: uint8ArrayFor0006Png, frameRealIndex: 76, },
    {frame: uint8ArrayFor0007Png, frameRealIndex: 77, },
    {frame: uint8ArrayFor0008Png, frameRealIndex: 78, },
    {frame: uint8ArrayFor0009Png, frameRealIndex: 79, },
    {frame: uint8ArrayFor0010Png, frameRealIndex: 80, },
]

export const start = async ()=>{
    for (let each of frameData) {
        // intentionally slow down
        await new Promise(r=>setTimeout(r,1000))
        trigger(newRgbImageEvent, each)
    }
}