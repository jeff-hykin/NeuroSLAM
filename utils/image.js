function toGrayscaleMagnitude(imgData, {redIndex = 0, greenIndex = 1, blueIndex = 2} = {}) {
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
    const { height, width, channels, depth } = imgData
    if (channels !== 1 && channels < 3) {
        throw new Error(`when calling toGrayscale(): the channels must be 1 or >=3, got ${channels}`)
    }
    const rowSize = width * channels
    let byteIndex = -rowSize
    let rowIndex = -1
    const rows = []
    const maxValue = ((2**depth)-1)*10000 // 10000 is to reduce precision loss when multipling proportions below, without this rgb 255 turns into 0.9999999999999999
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
                row[++cellIndex] = (2126 * (rowBytes[i+redIndex]) + 7152 * (rowBytes[i+greenIndex]) + 722 * (rowBytes[i+blueIndex]))/maxValue
                
                // TODO: could multiply by alpha
            }
        }
        rows.push(row)
    }
    return rows
}