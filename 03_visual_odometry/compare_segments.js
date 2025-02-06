// Assuming js-pytorch and other necessary functions are available
import { Tensor, Ops } from "../utils/tensor_wrapper.js"

// Function to compare two image segments
export function compareSegments({seg1, seg2, shiftLength, compareLengthOfIntensity}) {
    // Initialize the minimum difference to a large value
    let minimumDifferenceIntensity = 1e6
    let minimumOffset = 0

    // Initialize the differences array to store results
    let differences = Ops.zeros([shiftLength])

    // Convert the segments into torch tensors (assuming they are 1D arrays)
    const tensorSeg1 = new Tensor(seg1)
    console.debug(`tensorSeg1 is:`,tensorSeg1)
    const tensorSeg2 = new Tensor(seg2)

    // Loop through positive shifts
    for (let offset = 0; offset <= shiftLength; offset++) {
        // starts at 120, goes down in steps of 1, ends at 84
        // tensorSeg1.at([offset, compareLengthOfIntensity]).shape
        // tensorSeg2.at([0, (compareLengthOfIntensity-offset)]) // all zeros, seemingly on each iteration of this for loop

        // Slice the tensors and compute the absolute difference
        let compareDifferenceSegments = Ops.abs(
            tensorSeg1.at([offset, compareLengthOfIntensity]).subtract(
                tensorSeg2.at([0, (compareLengthOfIntensity-offset)])
            )
        )
            // 1.0798   0.9623   0.9759   1.0361   1.0680   0.9570   0.9836   0.9869
            // 0.9898   0.9952   0.9889   0.9798   0.9788   1.0042   1.0252   1.0200
            // 0.9918   1.0061   1.0286   0.9903   1.0149   1.1452   1.2151   1.2738
            // 1.2982   1.2426   1.1781   1.0954   1.0533   1.0074   1.1139   1.2234
            // 1.1950   1.1639   1.1497   1.1664   1.1726   1.0273   0.9147   0.8806
            // 0.9775   1.0501   1.0326   1.0122   1.0215   1.0102   1.0088   1.0061
            // 1.0107   1.0019   0.9769   0.9759   0.9614   0.9515   0.9226   0.9201
            // 0.9315   0.8598   0.7993   0.7914   0.7735   0.7532   0.7349   0.7184
            // 0.6804   0.6663   0.7382   0.7342   0.6984   0.6756   0.6786   0.6691
            // 0.6500   0.6486   0.6968   0.6685   0.6794   0.7107   0.6950   0.6767
            // 0.6564   0.6570   0.6345   0.6468

        // console.debug(`compareDifferenceSegments is:`,compareDifferenceSegments)
        // ends on: [
        //     0.9779600511977499, 0.9752281820303321, 0.9988097967777508,
        //     1.107354591247737, 0.9644798532944872, 0.9819243577035515,
        //     0.9902295876206855, 0.9857914573154964, 0.9977635783975422,
        //     0.9885896273287221, 0.9846867276615188, 0.9711380719620923,
        //     0.99460927489224, 1.0160313621081307, 1.0349766052362983,
        //     0.996420394773723, 0.9956971934193423, 1.0204807309227673,
        //     1.0243659260010383, 0.9650911466470583, 1.0933235154530028,
        //     1.1887473803092834, 1.2392439013626282, 1.3081401063958855,
        //     1.2819574776435751, 1.2051441142019184,  1.150724424396838,
        //     1.0590197230400444,  1.059437428284373, 1.0030309279679983,
        //     1.2120609920631567, 1.2127629659643864, 1.1829226053895496,
        //     1.154464520034414, 1.1495353243149145, 1.1719196014027409,
        //     1.1458838443736765, 0.9472708353245466, 0.8982059741697066,
        //     0.880879791681376, 1.0204261097288019, 1.0449725753865502,
        //     1.0185330432514006,  1.008587528509483, 1.0228890051802368,
        //     1.0026779763355662, 1.0085419571730152, 1.0022208955536482,
        //     1.0100189175391046, 0.9941300244988506, 0.9724898668502113,
        //     0.9762354387585136, 0.9572007803348169, 0.9492230511601852,
        //     0.9175116921435881, 0.9228473196935341, 0.9266576414879792,
        //     0.8418373535332001, 0.7932653828240614, 0.7913034664965479,
        //     0.7719899696049772, 0.7572166841143377, 0.7425940306789858,
        //     0.7225554221014757, 0.6845753179862257, 0.6778180194814787,
        //     0.7546258375625414, 0.7397349829496539, 0.7034111025019786,
        //     0.6852905966872336, 0.6866978544629971, 0.6737702830719483,
        //     0.6577831292068845,  0.656880335050526, 0.7057837257343664,
        //     0.6777376226686719, 0.6906857202213068, 0.7171905537849804,
        //     0.7013692714219899, 0.6804870255632317, 0.6625802456901202,
        //     0.6636277152701746, 0.6412773583003621, 0.6530742074751011
        // ]

        // Sum the differences and normalize
        let sumCompareDifferenceSegments = compareDifferenceSegments.sum() / (compareLengthOfIntensity - offset)
        differences[shiftLength - offset] = sumCompareDifferenceSegments

        // Update the minimum difference and offset
        if (sumCompareDifferenceSegments < minimumDifferenceIntensity) {
            minimumDifferenceIntensity = sumCompareDifferenceSegments
            minimumOffset = offset
        }
    }

    // Loop through negative shifts
    for (let offset = 1; offset <= shiftLength; offset++) {
        // Slice the tensors and compute the absolute difference
        let compareDifferenceSegments = Ops.abs(tensorSeg1.slice(0, compareLengthOfIntensity - offset).subtract(tensorSeg2.slice(offset, compareLengthOfIntensity)))

        // Sum the differences and normalize
        let sumCompareDifferenceSegments = compareDifferenceSegments.sum() / (compareLengthOfIntensity - offset)
        differences[shiftLength + offset] = sumCompareDifferenceSegments

        // Update the minimum difference and offset
        if (sumCompareDifferenceSegments < minimumDifferenceIntensity) {
            minimumDifferenceIntensity = sumCompareDifferenceSegments
            minimumOffset = -offset
        }
    }

    // Return the minimum offset and minimum difference intensity
    return { minimumOffset, minimumDifferenceIntensity }
}

// Explanation:

//     Tensor Operations: In js-pytorch, tensors are used for numerical operations similar to how they're used in PyTorch. The new Tensor() method is used to convert input arrays into tensors.
//     Slicing: I used the slice() function to mimic MATLAB's array slicing for comparing segments of seg1 and seg2.
//     Sum and Average: The sum is computed using .sum(), and the average is computed by dividing by the number of elements (compareLengthOfIntensity - offset).
//     Offset Calculations: For both positive and negative offsets, the code computes the differences and keeps track of the minimum difference and corresponding offset.

// Assumptions:

//     I’ve assumed the segments (seg1 and seg2) are already 1D arrays of intensity values, which is typical in image processing tasks.
//     The shiftLength and compareLengthOfIntensity are assumed to be integers specifying the range of offsets and the length of the intensity profile to compare, respectively.

// // Example usage
// let seg1 = [/* array of intensity values from current image */];
// let seg2 = [/* array of intensity values from previous image */];
// let shiftLength = 10; // example shift length
// let compareLengthOfIntensity = 20; // example intensity length to compare

// let result = compareSegments(seg1, seg2, shiftLength, compareLengthOfIntensity);
// console.log(result);
