import uint8ArrayForSynPanMineCsv from "../02_NeuroSLAM_Groudtruth.ignore/syn_pan_mine.csv.binaryified.js"
import uint8ArrayForSynPerMineCsv from "../02_NeuroSLAM_Groudtruth.ignore/syn_per_mine.csv.binaryified.js"
// import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.3.1/source/csv.js"
import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@34eba35/source/csv.js"

export const synpan = parseCsv({input: new TextDecoder().decode(uint8ArrayForSynPanMineCsv), firstRowIsColumnNames: true})
export const synper = parseCsv({input: new TextDecoder().decode(uint8ArrayForSynPerMineCsv), firstRowIsColumnNames: true})
for (let each of synpan.concat(synper)) {
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