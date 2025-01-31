import numpy as np


def get_gc_xyz():
    global GRIDCELLS
    global GC_X_DIM, GC_Y_DIM, GC_Z_DIM
    global GC_X_TH_SIZE, GC_Y_TH_SIZE, GC_Z_TH_SIZE
    global GC_X_SUM_SIN_LOOKUP, GC_X_SUM_COS_LOOKUP
    global GC_Y_SUM_SIN_LOOKUP, GC_Y_SUM_COS_LOOKUP
    global GC_Z_SUM_SIN_LOOKUP, GC_Z_SUM_COS_LOOKUP
    global GC_PACKET_SIZE
    global GC_MAX_X_WRAP, GC_MAX_Y_WRAP, GC_MAX_Z_WRAP

    # Find the max activated cell
    indexes = np.argwhere(GRIDCELLS)
    value, index = max(
        [(GRIDCELLS[tuple(idx)], idx) for idx in indexes], key=lambda x: x[0]
    )
    x, y, z = index

    # Take the max activated cell +- AVG_CELL in 3D space
    temp_gridcells = np.zeros((GC_X_DIM, GC_Y_DIM, GC_Z_DIM))

    temp_gridcells[
        GC_MAX_X_WRAP[x : x + GC_PACKET_SIZE * 2],
        GC_MAX_Y_WRAP[y : y + GC_PACKET_SIZE * 2],
        GC_MAX_Z_WRAP[z : z + GC_PACKET_SIZE * 2],
    ] = GRIDCELLS[
        GC_MAX_X_WRAP[x : x + GC_PACKET_SIZE * 2],
        GC_MAX_Y_WRAP[y : y + GC_PACKET_SIZE * 2],
        GC_MAX_Z_WRAP[z : z + GC_PACKET_SIZE * 2],
    ]

    x_sum_sin = np.sum(
        GC_X_SUM_SIN_LOOKUP * np.sum(np.sum(temp_gridcells, axis=1), axis=2)
    )
    x_sum_cos = np.sum(
        GC_X_SUM_COS_LOOKUP * np.sum(np.sum(temp_gridcells, axis=1), axis=2)
    )

    y_sum_sin = np.sum(
        GC_Y_SUM_SIN_LOOKUP * np.sum(np.sum(temp_gridcells, axis=0), axis=2)
    )
    y_sum_cos = np.sum(
        GC_Y_SUM_COS_LOOKUP * np.sum(np.sum(temp_gridcells, axis=0), axis=2)
    )

    temp_z_sum = np.sum(np.sum(temp_gridcells, axis=0), axis=1)

    z_sum = temp_z_sum.flatten()

    z_sum_sin = np.sum(GC_Z_SUM_SIN_LOOKUP * z_sum)
    z_sum_cos = np.sum(GC_Z_SUM_COS_LOOKUP * z_sum)

    gcX = np.mod(np.arctan2(x_sum_sin, x_sum_cos) / GC_X_TH_SIZE, GC_X_DIM)
    gcY = np.mod(np.arctan2(y_sum_sin, y_sum_cos) / GC_Y_TH_SIZE, GC_Y_DIM)
    gcZ = np.mod(np.arctan2(z_sum_sin, z_sum_cos) / GC_Z_TH_SIZE, GC_Z_DIM)

    return gcX, gcY, gcZ


# Key changes and explanations:

#     Finding the Maximum Activated Cell:
#         np.argwhere(GRIDCELLS) finds the indices where GRIDCELLS is non-zero.
#         The max function then retrieves the index of the maximum value in GRIDCELLS.

#     Array Slicing:
#         The slicing of the temp_gridcells and GRIDCELLS arrays is directly translated using NumPy indexing, which works similarly to MATLAB's array slicing.

#     Sum Operations:
#         NumPy's np.sum function is used to sum over specified axes, corresponding to MATLAB's sum functions.

#     Angle Calculation:
#         np.arctan2 is used for computing the angle, equivalent to MATLAB's atan2.
#         The result is then normalized using np.mod for modulus operation, similar to MATLAB's mod.

#     Global Variables:
#         Global variables like GC_X_DIM, GC_Y_DIM, etc., are assumed to be initialized earlier in the code.

# This Python version should work as intended if the GRIDCELLS, GC_X_DIM, GC_Y_DIM, GC_Z_DIM, and other necessary global variables are properly initialized.
