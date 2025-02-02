import { torch } from "../imports.js"

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
    sub: (...values)=>Object.setPrototypeOf(torch.sub(...values), TensorWrapper.prototype),
    mul: (...values)=>Object.setPrototypeOf(torch.mul(...values), TensorWrapper.prototype),
    div: (...values)=>Object.setPrototypeOf(torch.div(...values), TensorWrapper.prototype),
    sum: (...values)=>Object.setPrototypeOf(torch.sum(...values), TensorWrapper.prototype),
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
export class Tensor extends torch.Tensor {
    constructor(...args) {
        super(...args)
    }

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
    
    // later add slicing
    at(index) {
        return this.data[index > 0 ? index : this.length + index]
    }
    squeeze() {
        return this.reshape(this.shape.filter(each=>each!=1))
    }
    maskedFill(...args) {
        return this.masked_fill(...args)
    }
    toArray() {
        return this.tolist()
    }
}