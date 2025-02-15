import { Tensor, Ops, autoFillOps } from "../utils/tensor_wrapper_torch.js"

/**
 * Image resizing function
 *
 * @example
 * ```js
 * let height = 40
 * let width = 30
 * import { Ops as TfOps } from "../utils/tensor_wrapper_tf.js"
 * import { Ops as TorchOps } from "../utils/tensor_wrapper_torch.js"
 * console.log(_grayscaleBilinearResize({
 *     imageTensor: TorchOps.range(0, (height*width)).reshape([height,-1]),
 *     height: 4,
 *     width: 3,
 * },TorchOps))
 * // should output:
 * //data: [
 * //   [ 0, 7.25, 29 ],
 * //   [ 390, 202.25, 419 ],
 * //   [ 780, 397.25, 809 ],
 * //   [ 1170, 592.25, 1199 ],
 * //]
 * console.log(_grayscaleBilinearResize({
 *     imageTensor: TfOps.reshape(TfOps.range(0, (height*width)), [height,-1]),
 *     height: 4,
 *     width: 3,
 * },TfOps).print())
 * // should output:
 * //data: [
 * //   [ 0, 7.25, 29 ],
 * //   [ 390, 202.25, 419 ],
 * //   [ 780, 397.25, 809 ],
 * //   [ 1170, 592.25, 1199 ],
 * //]
 * ```
 */
export function _grayscaleBilinearResize({imageTensor, height, width}, { range, shapeOf, flatten, mul, add, sub, div, floor, ceil, neg, at, remainder, mod, dispose, reshape, }=Ops) {
    remainder = remainder||mod // doesn't matter for this
    // imageTensor = [ 0, 1, 2, ... 1199, ].reshape([imgHeight, imgWidth])
    const [imgHeight, imgWidth] = shapeOf(imageTensor)

    imageTensor = flatten(imageTensor)
    
    var xRatio = ((imgWidth - 1) / (width - 1) > 0)    ?   (imgWidth  - 1) / (width  - 1)   :   0
    var yRatio = ((imgHeight - 1) / (height - 1) > 0)  ?   (imgHeight - 1) / (height - 1)   :   0

    // Generate the grid of coordinates
    // var y = Ops.range(0, (imgHeight*imgWidth)-1)
    var y = range(0, (height*width))
    var x = remainder(y, width)
    y = div(sub(y, x), width)
    
    // height = 3
    // width = 4
    // x = [ 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3 ]
    // y = [ 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2 ] 
    
    x = mul(x, xRatio)  
    y = mul(y, yRatio)
    // Compute the lower and higher x and y indices
    var x_l = floor(x)
    var y_l = floor(y)
    
    var x_h = ceil(x)
    var y_h = ceil(y)

    // Calculate the weights for interpolation
    var x_weight = sub(x, x_l)
    var y_weight = sub(y, y_l)

    // Index the imageTensor based on calculated coordinates
    var l_width = mul(y_l, imgWidth)
    var h_width = mul(y_h, imgWidth)
    var a = at(imageTensor, [add(l_width, x_l)])
    var b = at(imageTensor, [add(l_width, x_h)])
    var c = at(imageTensor, [add(h_width, x_l)])
    var d = at(imageTensor, [add(h_width, x_h)])
    
    var x_neg = sub(1, x_weight)
    var y_neg = sub(1, x_weight)
    // Perform the bilinear interpolation
    return reshape(
        add(
            mul(
                a,
                x_neg,
                y_neg,
            ),
            mul(b, x_weight, y_neg),
            mul(c, y_weight, x_neg),
        ),
        [height, width]
    )
    // array([[   0.,   13.,   26.,   39.],
    //    [ 580.,  593.,  606.,  619.],
    //    [1160., 1173., 1186., 1199.]])
}
// _grayscaleBilinearResize(Ops.range(0, (imgHeight*imgWidth)-1).reshape([imgHeight,imgWidth]), 3,4)

export function toGrayscaleMagnitude(imgData, {redIndex = 0, greenIndex = 1, blueIndex = 2, redWeight= 0.29890, greenWeight= 0.58700, blueWeight= 0.11400, force8BitAccuracy=false} = {}) {
    // imgData example: (output of https://github.com/jeff-hykin/fast-png)
    // {
    //   width: 480,
    //   height: 200,
    //   channels: 3,
    //   data: Uint16Array(288000) [
    //     22063, 31061, 40914, 22064, 31062, 40914, 22061, 31057,
    //     40909, 22077, 31080, 40942, 22044, 31032, 40873, 22073,
    //     31076, 40939, 22056, 31052, 40905, 22054, 31051, 40898,
    //     22068, 31076, 40935, 22054, 31050, 40902, 22060, 31052,
    //     40906, 22055, 31049, 40903, 22062, 31062, 40926, 22047,
    //     31040, 40895, 22059, 31057, 40917, 22037, 31027, 40876,
    //     22034, 31022, 40871, 22050, 31047, 40906, 22035, 31025,
    //     40873, 22050, 31046, 40904, 22038, 31030, 40879, 22033,
    //     31024, 40869, 22037, 31028, 40873, 22037, 31024, 40868,
    //     22052, 31042, 40896, 22051, 31040, 40900, 22040, 31029,
    //     40892, 22024, 31007, 40856, 22023, 31005, 40857, 22040,
    //     31030, 40891, 22027, 31009, 40856, 22028, 31006, 40853,
    //     22037, 31021, 40879, 22023,
    //     ... 287900 more items
    //   ],
    //   depth: 16,
    //   text: {
    //     File: "C:\\Dataset\\3dratslam_synthetic_blender_file\\08_3d_ml_opposite_view\\3d_ml_opposite_view_5000_20190128.blend",
    //     Date: "2019/01/28 22:20:50",
    //     Time: "00:00:00:01",
    //     Frame: "0001",
    //     Camera: "Camera",
    //     Scene: "Scene",
    //     RenderTime: "00:56.38"
    //   },
    //   resolution: { x: 2835, y: 2835, unit: 1 }
    // }
    const multiplier = 10000 // 10000 is to reduce precision loss when multipling proportions below, without this rgb 255 turns into 0.9999999999999999
    redWeight = redWeight*multiplier
    greenWeight = greenWeight*multiplier
    blueWeight = blueWeight*multiplier
    const { height, width, channels, depth } = imgData
    if (channels !== 1 && channels < 3) {
        throw new Error(`when calling toGrayscale(): the channels must be 1 or >=3, got ${channels}`)
    }
    const rowSize = width * channels
    let byteIndex = -rowSize
    let rowIndex = -1
    const rows = []
    let maxValue = (((2**depth)-1)*multiplier)

    while (++rowIndex < height) {
        byteIndex+=rowSize
        let rowBytes = imgData.data.slice(byteIndex, byteIndex + rowSize)
        let row = Array(width).fill()
        let cellIndex = -1
        if (channels === 1) {
            for (let i = 0; i < rowBytes.length; i += channels) {
                row[++cellIndex] = rowBytes[i]/maxValue
            }
        } else {
            for (let i = 0; i < rowBytes.length; i += channels) {
                row[++cellIndex] = (redWeight * (rowBytes[i+redIndex]) + greenWeight * (rowBytes[i+greenIndex]) + blueWeight * (rowBytes[i+blueIndex]))/maxValue
            }
        }
        rows.push(row)
    }
    rows.height = height
    rows.width = width
    return rows
}