import { Event, trigger, everyTime, everyTimeAllLatestOf, once } from "../../utils/event_manager.js"
import { newGrayscaleImageEvent } from "./event.js"
import { decode } from "../utils/png.js"
import { toGrayscaleMagnitude } from "../utils/image.js"

// input events
import { newRgbImageEvent } from "../generate_frames/event.js"

everyTime(newRgbImageEvent).then(({frame, ...other})=>{
    const curGrayImg = toGrayscaleMagnitude(
        decode(
            frame
        ),
    )
    trigger(newGrayscaleImageEvent, {
        ...other,
        frame: curGrayImg,
    })
})