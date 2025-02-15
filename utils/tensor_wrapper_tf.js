import * as tf from "https://esm.sh/@tensorflow/tfjs@4.22.0"
import { isIterableTechnically } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.2.1/source/flattened/is_iterable_technically.js"

const toTensor = (tensor)=>{
    if (!(tensor instanceof tf.Tensor)) {
        tensor = new tf.Tensor(tensor)
    }
    return tensor
}
const _transformElements = (array, fn)=>{
    if (array[0] instanceof Array) {
        for (let each of array) {
            _transformElements(each, fn)
        }
    } else {
        var i=-1
        for (var each of array) {
            i++
            array[i] = fn(each)
        }
    }
}
const atIndex = (tensor, indicies)=>{
    return tensor.slice(indicies, indicies.map(each=>1)).reshape(tensor.shape.slice(indicies.length))
}
const sliceRanges = (data, slices, originalShape) => {
    let shape = data.shape
    let i = -1
    const starts = Array(slices.length).fill(0)
    const lengths = Array(slices.length).fill(0)
    for (const {start, end} of slices) {
        i++
        if (start == null) {
            starts[i] = 0
        } else if (start < 0) {
            starts[i] = shape[i]-start
        } else {
            starts[i] = start
        }

        if (end == null) {
            lengths[i] = shape[i]-starts[i]
        } else if (end < 0) {
            lengths[i] = (shape[i]-end)-starts[i]
        } else {
            lengths[i] = end-starts[i]
        }
    }
    return data.slice(starts, lengths, 0)
}
var indent = ""
const recursiveSlice = (data, slices, originalShape) => {
    indent += "    "
    if (!slices || slices.length == 0) {
        return data
    }
    if (slices.every(each=>each.start != null || each.end != null)) {
        return sliceRanges(data, slices, originalShape)
    } else {
        slices = [...slices]
        let slice = slices.shift()
        let result
        if (typeof slice == "number") {
            // basically is a kind of flattener
            result = atIndex(data, [slice])
            return recursiveSlice(result, slices, originalShape)
        } else {
            if (slice.start != null || slice.end != null) {
                result = sliceRanges(data, [slice], originalShape)
            } else if (isIterableTechnically(slice)) {
                result = tf.gather([...slice])
            } else if (slice instanceof tf.Tensor) {
                result = tf.gather([...slice.dataSync()])
            } else {
                throw Error(`sorry, slice ${slice} is not a valid index or slice`)
            }
            
            if (slices.length == 0) {
                return result
            } else {
                let length = result.shape[0]
                // TODO: error (out of bounds) if length is null
                let results = Array(length)
                while (length--) {
                    const each = atIndex(result, [length])
                    results[length] = recursiveSlice(each, slices, originalShape)
                }
                return tf.stack(results)
            }
        }
    }
}
const subtract = (...values)=>Ops.add(values.shift(), ...values.map(Ops.negative))
const Ops = {
    range: (start, end, {step=1}={}) => tf.range(start, end, step),
    shapeOf: (tensor)=>tensor.shape,
    flatten: (tensor)=>tensor.flatten(),
    mul: (...args)=>tf.mul(...args),
    add: (...args)=>tf.add(...args),
    subtract,
    sub: subtract,
    div: (tensor1, tensor2)=>tf.div(tensor1, tensor2),
    floor: (tensor)=>tf.floor(tensor),
    ceil: (tensor)=>tf.ceil(tensor),
    neg: (tensor)=>tf.neg(tensor),
    atIndex,
    at: (tensor, indexOrSlices)=>{
        return recursiveSlice(tensor, indexOrSlices, tensor.shape)
    },
    mod: (tensor, divisor)=>tf.mod(tensor, divisor),
    dispose: (tensor)=>tensor.dispose&&tensor.dispose(),
    reshape: (tensor, shape)=>tensor.reshape(shape),
}