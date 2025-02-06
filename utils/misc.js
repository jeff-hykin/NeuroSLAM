export function arrayOf({value, shape}) {
    let output = new Array(shape.pop()).fill(value)
    while (shape.length > 0) {
        let nextSize = shape.pop()
        output = new Array(nextSize).fill(0).map(() => structuredClone(output))
    }
    return output
}