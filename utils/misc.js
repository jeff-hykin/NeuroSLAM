import {
    TermColorizer,
    AnsiColors,
} from "https://esm.sh/gh/jahzielv/deno-term-color/termcolorizer.ts"

export function arrayOf({value=null, shape}) {
    if (!(value instanceof Function)) {
        let originalValue = value
        value = () => originalValue
    }
    let output = new Array(shape.pop()).fill(0).map((_, i) => value(i))
    while (shape.length > 0) {
        let nextSize = shape.pop()
        output = new Array(nextSize).fill(0).map(() => structuredClone(output))
    }
    return output
}

const tc = new TermColorizer()
export const crappyRenderAsAsciiGrayscale = (imgIntentsityTensor)=>{
    let width = 5
    const intensity = (value)=> tc.colorize(value=`${value}`.padStart(width," "), {
        fore: AnsiColors.White,
        back: [`${value}`, `${value}`, `${value}`].join(", "),
    })
    const intensityGap = (value)=> tc.colorize((value=`${value}`.padStart(width," "), "     "), {
        fore: AnsiColors.White,
        back: [`${value}`, `${value}`, `${value}`].join(", "),
    })
    let as255 = Ops.elementMap(imgIntentsityTensor, each=>Math.round(each*255))
    for (let each of as255.data) {
        console.log(each.map(intensityGap).join(""))
        console.log(each.map(intensity).join(""))
    }
}

function _circShiftInner(arr, shift) {
    let newData = arr
    let shiftAmount = shift[0]
    shiftAmount = shiftAmount % arr.length
    if (shiftAmount != 0) {
        let firstHalf = arr.slice(0, shiftAmount)
        let secondHalf = arr.slice(shiftAmount)
        newData = secondHalf.concat(firstHalf)
    }
    if (shift.length != 1) {
        const remaining = shift.slice(1)
        return newData.map(each=>_circShiftInner(each, remaining))
    }
    return newData
}
export function circShift(tensor, shift) {
    // 
    // standardize shift arg
    // 
        if (!(shift instanceof Array)) {
            shift = [shift,]
        }
        let missingDimensions = shift.length - tensor.shape.length
        if (missingDimensions < 0) {
            // try to shed extra dims
            while (shift.at(-1) == 0) {
                shift.pop()
            }
            missingDimensions = shift.length - tensor.shape.length
            if (missingDimensions < 0) {
                throw new Error(`circShift was called on a tensor of shape ${tensor.shape}, but too many shift values were provided: ${shift}`)
            }
        }
    // 
    // perform shift
    //
    return new Tensor(
        _circShiftInner(tensor.data, shift)
    )
}