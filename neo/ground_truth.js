import uint8ArrayForSynPanMineCsv from "../02_NeuroSLAM_Groudtruth.ignore/syn_pan_mine.csv.binaryified.js"
// import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.3.1/source/csv.js"
import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@34eba35/source/csv.js"

const csvText = new TextDecoder().decode(uint8ArrayForSynPanMineCsv)
export const synpan = parseCsv({input: csvText, firstRowIsColumnNames: true})
for (let each of synpan) {
    each.toJSON = ()=>{
        let out = {}
        for (const [key, value] of Object.entries(each)) {
            if (!key.match(/^[0-9]+$/)) {
                out[key] = value
            }
        }
        return out
    }
}