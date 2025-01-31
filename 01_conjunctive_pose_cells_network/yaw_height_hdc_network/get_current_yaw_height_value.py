import numpy as np


def get_current_yaw_height_value():
    global YAW_HEIGHT_HDC
    global YAW_HEIGHT_HDC_Y_DIM
    global YAW_HEIGHT_HDC_H_DIM
    global YAW_HEIGHT_HDC_MAX_Y_WRAP
    global YAW_HEIGHT_HDC_MAX_H_WRAP
    global YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP
    global YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP
    global YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP
    global YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP
    global YAW_HEIGHT_HDC_PACKET_SIZE
    global YAW_HEIGHT_HDC_Y_TH_SIZE
    global YAW_HEIGHT_HDC_H_SIZE

    # Find the index of the maximally activated cell
    indexes = np.where(YAW_HEIGHT_HDC)
    value = np.max(YAW_HEIGHT_HDC[indexes])
    index = np.argmax(YAW_HEIGHT_HDC[indexes])
    y, h = np.unravel_index(index, YAW_HEIGHT_HDC.shape)

    # Take the max activated cell +- AVG_CELL in 2D space
    tempYawHeightHdc = np.zeros((YAW_HEIGHT_HDC_Y_DIM, YAW_HEIGHT_HDC_H_DIM))

    y_wrap = YAW_HEIGHT_HDC_MAX_Y_WRAP[y : y + YAW_HEIGHT_HDC_PACKET_SIZE * 2]
    h_wrap = YAW_HEIGHT_HDC_MAX_H_WRAP[h : h + YAW_HEIGHT_HDC_PACKET_SIZE * 2]

    tempYawHeightHdc[np.ix_(y_wrap, h_wrap)] = YAW_HEIGHT_HDC[np.ix_(y_wrap, h_wrap)]

    yawSumSin = np.sum(
        np.dot(YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP, np.sum(tempYawHeightHdc, axis=1))
    )
    yawSumCos = np.sum(
        np.dot(YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP, np.sum(tempYawHeightHdc, axis=1))
    )

    heightSumSin = np.sum(
        np.dot(YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP, np.sum(tempYawHeightHdc, axis=0))
    )
    heightSumCos = np.sum(
        np.dot(YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP, np.sum(tempYawHeightHdc, axis=0))
    )

    # Compute the yaw and height using atan2
    outYawTheta = np.mod(
        np.arctan2(yawSumSin, yawSumCos) / YAW_HEIGHT_HDC_Y_TH_SIZE,
        YAW_HEIGHT_HDC_Y_DIM,
    )
    outHeightValue = np.mod(
        np.arctan2(heightSumSin, heightSumCos) / YAW_HEIGHT_HDC_H_SIZE,
        YAW_HEIGHT_HDC_H_DIM,
    )

    return outYawTheta, outHeightValue


# Explanation of Changes:

#     Finding the Max Activated Cell:
#         In MATLAB, find() and ind2sub() are used to locate indices in a multi-dimensional array. In Python, we can use np.where() to find the non-zero indices, and np.argmax() to locate the index of the maximum value. np.unravel_index() is then used to convert the flat index back to the multi-dimensional index (y, h).

#     Creating Temporary Matrix:
#         The 2D matrix tempYawHeightHdc is initialized as a zero matrix of the same size as the yaw-height space (YAW_HEIGHT_HDC_Y_DIM and YAW_HEIGHT_HDC_H_DIM).
#         The relevant section of YAW_HEIGHT_HDC is copied into tempYawHeightHdc using np.ix_ for indexing.

#     Calculating Sine and Cosine Sums:
#         The calculation for yawSumSin, yawSumCos, heightSumSin, and heightSumCos uses np.sum() to sum the values across the appropriate axes, then the weighted sums are computed using np.dot(), just as in the MATLAB code.

#     Final Yaw and Height Calculations:
#         np.arctan2() is used for the inverse tangent operation, similar to MATLAB’s atan2(), to compute the angle in radians.
#         The result is then adjusted using np.mod() to wrap the values within the appropriate range (modulo the dimensions).

#     Global Variables:
#         As in the MATLAB code, we declare the required global variables (global <var_name>) within the function to ensure they are accessed and modified correctly.

# Assumptions:

#     The global variables (YAW_HEIGHT_HDC, YAW_HEIGHT_HDC_Y_DIM, etc.) are assumed to be defined elsewhere in the program, similar to how they are in the MATLAB code.
#     The wrap functions (YAW_HEIGHT_HDC_MAX_Y_WRAP and YAW_HEIGHT_HDC_MAX_H_WRAP) are used to determine the bounds for extracting a "packet" around the most active cell.

# This Python code should function equivalently to the original MATLAB code with the added benefit of using Python libraries like NumPy for array manipulations
