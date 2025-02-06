// Assuming js-pytorch and other necessary functions are available
import { Tensor, Ops } from "../utils/tensor_wrapper.js"

// Function to compare two image segments
// NOTE: ths JS version seems to be fully correct!
export function compareSegments({seg1, seg2, shiftLength, compareLengthOfIntensity}) {
    // Initialize the minimum difference to a large value
    let minimumDifferenceIntensity = 1e6
    let minimumOffset = 0

    // Initialize the differences array to store results
    let differences = Array(shiftLength).fill(0)

    // Convert the segments into torch tensors (assuming they are 1D arrays)
    const tensorSeg1 = new Tensor(seg1)
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
        // console.log(compareDifferenceSegments.data.map(each=>each.toFixed(4)).join(" "))
            // this=  1.1234 0.9719 0.9701 0.9946 1.1007 0.9594 0.9770 0.9845 0.9829 0.9940 0.9866 0.9843 0.9682 0.9935 1.0111 1.0308 0.9939 0.9918 1.0189 1.0220 0.9620 1.0907 1.1867 1.2334 1.2983 1.2735 1.2024 1.1461 1.0518 1.0518 0.9929 1.2064 1.2058 1.1782 1.1508 1.1482 1.1694 1.1450 0.9518 0.9021 0.8843 1.0234 1.0466 1.0192 1.0079 1.0214 1.0015 1.0078 1.0018 1.0085 0.9932 0.9691 0.9732 0.9535 0.9454 0.9141 0.9194 0.9238 0.8390 0.7903 0.7883 0.7668 0.7475 0.7296 0.7122 0.6736 0.6681 0.7434 0.7281 0.6923 0.6724 0.6767 0.6656 0.6470 0.6485 0.6964 0.6653 0.6788 0.7093 0.6920 0.6741 0.6541 0.6550 0.6325
            // matlab=1.0798 0.9623 0.9759 1.0361 1.0680 0.9570 0.9836 0.9869 0.9898 0.9952 0.9889 0.9798 0.9788 1.0042 1.0252 1.0200 0.9918 1.0061 1.0286 0.9903 1.0149 1.1452 1.2151 1.2738 1.2982 1.2426 1.1781 1.0954 1.0533 1.0074 1.1139 1.2234 1.1950 1.1639 1.1497 1.1664 1.1726 1.0273 0.9147 0.8806 0.9775 1.0501 1.0326 1.0122 1.0215 1.0102 1.0088 1.0061 1.0107 1.0019 0.9769 0.9759 0.9614 0.9515 0.9226 0.9201 0.9315 0.8598 0.7993 0.7914 0.7735 0.7532 0.7349 0.7184 0.6804 0.6663 0.7382 0.7342 0.6984 0.6756 0.6786 0.6691 0.6500 0.6486 0.6968 0.6685 0.6794 0.7107 0.6950 0.6767 0.6564 0.6570 0.6345 0.6468

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