import {
    TermColorizer,
    AnsiColors,
} from "https://esm.sh/gh/jahzielv/deno-term-color/termcolorizer.ts"

export function arrayOf({value=0, shape}) {
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