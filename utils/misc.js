export function arrayOf({value, shape}) {
    if (!(value instanceof Function)) {
        value = () => value
    }
    let output = new Array(shape.pop()).fill(0).map((_, i) => value(i))
    while (shape.length > 0) {
        let nextSize = shape.pop()
        output = new Array(nextSize).fill(0).map(() => structuredClone(output))
    }
    return output
}