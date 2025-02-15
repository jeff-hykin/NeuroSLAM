import { torch } from "../imports.js"
import { isIterableTechnically } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.2.1/source/flattened/is_iterable_technically.js"

const count = function* (start = 0, end = Infinity, step = 1) {
    let count = start
    while (count <= end) {
        yield count
        count += step
    }
}
const product = (array)=>{
    let result = 1
    for (let each of array) {
        result *= each
    }
    return result
}

const toTensor = (tensor)=>{
    if (!(tensor instanceof Tensor)) {
        if (tensor instanceof torch.Tensor) {
            Object.setPrototypeOf(tensor, Tensor.prototype)
        } else if (tensor instanceof Array) {
            tensor = new Tensor(tensor)
        }
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
const recursiveSlice = (data, slices, originalShape) => {
    if (!slices || slices.length == 0) {
        return data
    }
    slices = [...slices]
    let slice = slices.shift()
    let result
    // slice object
    if (slice.start != null || slice.end != null) {
        result = data.slice(slice.start||0, slice.end||data.length)
        if (slices.length == 0) {
            return result
        } else {
            return result.map(each=>recursiveSlice(each, slices, originalShape))
        }
    } else if (isIterableTechnically(slice)) {
        return [...slice].map(each=>recursiveSlice(data.at(each), slices, originalShape))
    } else if (slice == null) {
        result = data
        if (slices.length == 0) {
            return result
        } else {
            return result.map(each=>recursiveSlice(each, slices, originalShape))
        }
    } else if (typeof slice == "number") {
        if (data.length <= slice) {
            throw Error(`tried to get index ${slice} of a dimension of size ${data.length}, from a tensor with an original shape of ${originalShape}`)
        }
        result = data.at(slice)
        if (slices.length == 0) {
            return result
        } else {
            return recursiveSlice(result, slices, originalShape)
        }
    } else {
        throw Error(`slice ${slice} is not a valid index or slice`)
    }
}
export const Ops = {
    // init helpers
    ones: (shape)=>Object.setPrototypeOf(torch.ones(shape), Tensor.prototype),
    zeros: (shape)=>Object.setPrototypeOf(torch.zeros(shape), Tensor.prototype),
    range: (start, end, {step=1}={}) => {
        let output = new Tensor(Array.from(count(start, end=end-1, step)))
        output.start = start
        output.end = end
        output.step = step
        return output
    },
    randomNormal: (shape)=>Object.setPrototypeOf(torch.randn(shape), Tensor.prototype),
    // mappings
    mapTop(tensor, fn) {
        return toTensor(tensor).data.map(fn)
    },
    _transformElements: (tensor, fn)=>{
        _transformElements(tensor?.data||tensor, fn)
        return tensor
    },
    transformElements: (tensor, fn)=>{
        let arrayClone = structuredClone(tensor?.data||tensor)
        _transformElements(arrayClone, fn)
        return new Tensor(arrayClone)
    },
    // single tensor ops
    atIndex(tensor, index) {
        if (!(index instanceof Array)) {
            throw Error(`atIndex() expects an array of indices, got ${index}`)
        }
        return toTensor(tensor).at(index)
    },
    at(tensor, indicesOrSlices) {
        return toTensor(tensor).at(...indicesOrSlices)
    },
    gather(tensor, indices, {axis=0}={}) {
        return 
    },
    shapeOf(tensor) {
        return toTensor(tensor).shape
    },
    reshape(tensor, shape) {
        return toTensor(tensor).reshape(shape)
    },
    floor(tensor) {
        if (typeof tensor == "number") {
            return Math.floor(tensor)
        }
        return toTensor(tensor).floor()
    },
    ceil(tensor) {
        if (typeof tensor == "number") {
            return Math.ceil(tensor)
        }
        return toTensor(tensor).ceil()
    },
    flatten(tensor, {depth=null}={}) {
        return toTensor(tensor).flatten(depth)
    },
    disposeOf(tensor) {
        // note: this is more of a shim so that other libraries can use the same name
        if (tensor.dispose instanceof Function) {
            tensor.dispose()
        }
    },
    // elementwise
    negative: (tensor)=>toTensor(tensor).neg(),
    abs: (tensor)=>{
        tensor = toTensor(tensor)
        return Ops.transformElements(tensor, a=>Math.abs(a))
    },
    add: (...values)=>Object.setPrototypeOf(torch.add(...values), Tensor.prototype),
    subtract: (...values)=>Ops.add(values.shift(), ...values.map(a=>a.neg())),
    mul: (...values)=>Object.setPrototypeOf(torch.mul(...values), Tensor.prototype),
    div: (...values)=>Object.setPrototypeOf(torch.div(...values), Tensor.prototype),
    remainder(tensor, divisor){
        tensor = toTensor(tensor)
        return Ops.transformElements(tensor, a=>a%divisor)
    },
    // group ops
    sum: (...values)=>{
        values = values.map(toTensor)
        Object.setPrototypeOf(torch.sum(...values), Tensor.prototype)
    },
    crossProduct: (...values)=>Object.setPrototypeOf(torch.matmul(...values), Tensor.prototype),
    // TODO:
        // concat/stack-type stuff
        // slice
        // min/max
        // argmin/argmax
    // stackVertical: (...values)=>{
    //     if (values.length == 0) {
    //         throw Error(`Cannot stack zero tensors together (zero length tensor not allowed)`)
    //     }
    //     let shape = values[0].shape
    //     shape.splice(0, 1)
    //     // check shapes
    //     for (let each of values) {
    //         const otherShape = each.shape
    //         otherShape.splice(0, 1)
    //         // if remaining dimensions are not equal
    //         if (otherShape.some((each,index)=>each!=shape[index])) {
    //             throw Error(`Cannot stackVertical() tensors with different number of rows: ${each.shape} and ${values[0].shape}`)
    //         }
    //     }
    //     let newElements = []
    //     for (const each of values) {
    //         newElements.push(...each.tolist())
    //     }
    //     return new Tensor(newElements)
    // },
}

export class Tensor extends torch.Tensor {
    constructor(...args) {
        if (args[0] instanceof torch.Tensor) {
            args[0] = args[0].data
        }
        super(...args)
    }

    // 
    // fundamentally changes behavior of method
    // 
    at(...dimensions) {
        let output = recursiveSlice(this.data, dimensions, this.shape)
        if (output instanceof Array) {
            output = new Tensor(output)
        }
        return output
    }
    sum(dim, keepdims=false) {
        if (dim == null) {
            if (this.shape.length == 1) {
                return super.sum().data[0]
            } else {
                return this.flatten().sum()
            }
        } else {
            return Object.setPrototypeOf(super.sum(dim, keepdims), Tensor.prototype)
        }
    }
    mean(dim, keepdims=false) {
        if (dim == null) {
            if (this.shape.length == 1) {
                return super.mean().data[0]
            } else {
                return this.flatten().mean()
            }
        } else {
            return Object.setPrototypeOf(super.mean(dim, keepdims), Tensor.prototype)
        }
    }
    variance(dim, keepdims=false) {
        if (dim == null) {
            if (this.shape.length == 1) {
                return super.variance().data[0]
            } else {
                return this.flatten().variance()
            }
        } else {
            return Object.setPrototypeOf(super.variance(dim, keepdims), Tensor.prototype)
        }
    }
    stdev(dim, keepdims=false) {
        if (dim == null) {
            if (this.shape.length == 1) {
                return super.variance().sqrt().data[0]
            } else {
                return this.flatten().stdev()
            }
        } else {
            return Object.setPrototypeOf(super.variance(dim, keepdims).sqrt(), Tensor.prototype)
        }
    }
    
    // 
    // adds or removes defaults
    // 
    transpose(dim1, dim2) {
        if (dim1 != null && dim2 != null) {
            if (this.shape.length <= 2) {
                return super.transpose(0, 1)
            } else {
                throw Error(`To transpose tensor with more than 2 dimensions, you must specify which dimensions to swap (dim1, dim2)\nbtw they are 0 indexed\nThis occured for a tensor with a shape of ${this.shape}`)
            }
        } else {
            return super.transpose(dim1, dim2)
        }
    }
    reshape(newShape) {
        // handle -1 to infer the size
        var index=-1
        for (var eachDim of newShape) {
            index++
            if (eachDim == -1) {
                const necessaryProduct = product(this.shape)
                const currentProduct = product(newShape.toSpliced(index, 1))
                const missingValue = necessaryProduct / currentProduct
                if (missingValue <= 0) {
                    throw Error(`Reshape error: cannot reshape ${this.shape} to ${newShape}, the current shape has a product of ${necessaryProduct} and the new shape has a product of ${currentProduct}\nThe -1 would need to be ${missingValue} to make the reshape work, which is not valid`)
                }
                newShape[index] = missingValue
                break // only one -1 allowed
            }
        }
        return Object.setPrototypeOf(super.reshape(newShape), Tensor.prototype)
    }
    
    // 
    // renamed
    // 
    maskedFill(...args) {
        return Object.setPrototypeOf(this.masked_fill(...args), Tensor.prototype) 
    }
    subtract(...args) {
        return Object.setPrototypeOf(super.sub(...args), Tensor.prototype)
    }
    toArray() {
        return this.tolist()
    }


    // 
    // new polyfill methods
    // 
    get squeezed() {
        return Object.setPrototypeOf(this.reshape(this.shape.filter(each=>each!=1)), Tensor.prototype)
    }
    flatten(depth) {
        if (depth == null) {
            return this.reshape([-1])
        } else {
            const shape = this.shape
            shape.splice(0, depth, -1)
            return this.reshape(shape)
        }
    }
    slice(...args) {
        return new Tensor(this.data.slice(...args))
    }
    floor() {
        return Ops.transformElements(this, a=>Math.floor(a))
    }
    ceil() {
        return Ops.transformElements(this, a=>Math.ceil(a))
    }
    round(digits=0) {
        if (digits == 0) {
            return Ops.transformElements(this, a=>Math.ceil(a))
        } else {
            return Ops.transformElements(this.mul(10**digits), a=>Math.ceil(a)).div(10**digits)
        }
    }
    mapTop(fn) {
        return new Tensor(this.data.map(fn))
    }

    // 
    // wrap output of these:
    // 
    add(...args) {
        return Object.setPrototypeOf(super.add(...args), Tensor.prototype)
    }
    div(...args) {
        return Object.setPrototypeOf(super.div(...args), Tensor.prototype)
    }
    exp(...args) {
        return Object.setPrototypeOf(super.exp(...args), Tensor.prototype)
    }
    log(...args) {
        return Object.setPrototypeOf(super.log(...args), Tensor.prototype)
    }
    masked_fill(...args) {
        return Object.setPrototypeOf(super.masked_fill(...args), Tensor.prototype)
    }
    matmul(...args) {
        return Object.setPrototypeOf(super.matmul(...args), Tensor.prototype)
    }
    mul(...args) {
        return Object.setPrototypeOf(super.mul(...args), Tensor.prototype)
    }
    neg(...args) {
        return Object.setPrototypeOf(super.neg(...args), Tensor.prototype)
    }
    pow(...args) {
        return Object.setPrototypeOf(super.pow(...args), Tensor.prototype)
    }
    sqrt(...args) {
        return Object.setPrototypeOf(super.sqrt(...args), Tensor.prototype)
    }
    sub(...args) {
        return Object.setPrototypeOf(super.sub(...args), Tensor.prototype)
    }
    transpose(...args) {
        return Object.setPrototypeOf(super.transpose(...args), Tensor.prototype)
    }
}