import { torch } from "../imports.js"
import { zipShort as zip } from "https://deno.land/x/good@1.14.2.1/flattened/zip_short.js"

const count = function* (start = 0, end = Infinity, step = 1) {
    let count = start
    while (count <= end) {
        yield count
        count += step
    }
}

export const Ops = {
    ones: (shape)=>Object.setPrototypeOf(torch.ones(shape), TensorWrapper.prototype),
    zeros: (shape)=>Object.setPrototypeOf(torch.zeros(shape), TensorWrapper.prototype),
    range: (start, end, {step=1}={}) => new TensorWrapper(Array.from(count(start, end, step))),
    abs: (tensor)=>Object.setPrototypeOf(tensor.masked_fill(a=>a<=0, 1).masked_fill(a=>a>0, -1).mul(tensor), TensorWrapper.prototype),
    add: (...values)=>Object.setPrototypeOf(torch.add(...values), TensorWrapper.prototype),
    subtract: (...values)=>Object.setPrototypeOf(torch.sub(...values), TensorWrapper.prototype),
    mul: (...values)=>Object.setPrototypeOf(torch.mul(...values), TensorWrapper.prototype),
    div: (...values)=>Object.setPrototypeOf(torch.div(...values), TensorWrapper.prototype),
    sum: (...values)=>Object.setPrototypeOf(torch.sum(...values), TensorWrapper.prototype),
    crossProduct: (...values)=>Object.setPrototypeOf(torch.matmul(...values), TensorWrapper.prototype),
    randomNormal: (shape)=>Object.setPrototypeOf(torch.randn(shape), TensorWrapper.prototype),
    // TODO:
        // concat/stack-type stuff
        // slice
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
    //     return new TensorWrapper(newElements)
    // },
}
const recursiveSlice = (data, slices, originalShape) => {
    if (!slices || slices.length == 0) {
        return data
    }
    slices = [...slices]
    let slice = slices.shift()
    let result
    if (slice instanceof Array) {
        result = data.slice(slice[0], slice[1])
        if (slices.length == 0) {
            return result
        } else {
            return result.map(each=>recursiveSlice(each, slices, originalShape))
        }
    } else if (slice == null) {
        result = data
        if (slices.length == 0) {
            return result
        } else {
            return result.map(each=>recursiveSlice(each, slices, originalShape))
        }
    } else {
        if (data.length <= slice) {
            throw Error(`tried to get index ${slice} of a dimension of size ${data.length}, from a tensor with an original shape of ${originalShape}`)
        }
        result = data.at(slice)
        if (slices.length == 0) {
            return result
        } else {
            return recursiveSlice(result, slices, originalShape)
        }
    }
}
export class Tensor extends torch.Tensor {
    constructor(...args) {
        super(...args)
    }

    // 
    // fundamentally changes behavior of method
    // 
    at(...dimensions) {
        return recursiveSlice(this.data, dimensions, this.shape)
    }
    sum(dim, keepdims=false) {
        if (dim == null) {
            return this.flatten().sum().data[0]
        } else {
            return Object.setPrototypeOf(super.sum(dim, keepdims), Tensor.prototype)
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
        for (let index; index < newShape.length; index++) {
            if (newShape[index] == -1) {
                const necessaryProduct = product(this.shape)
                const currentProduct = product(newShape.splice(index, 1))
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
    mean(...args) {
        return Object.setPrototypeOf(super.mean(...args), Tensor.prototype)
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
    reshape(...args) {
        return Object.setPrototypeOf(super.reshape(...args), Tensor.prototype)
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
    variance(...args) {
        return Object.setPrototypeOf(super.variance(...args), Tensor.prototype)
    }
}