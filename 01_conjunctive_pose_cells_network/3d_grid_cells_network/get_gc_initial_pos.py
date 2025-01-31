import numpy as np


def get_gc_initial_pos():
    global GC_X_DIM, GC_Y_DIM, GC_Z_DIM

    # Set the initial position in the grid cell network
    gcX = GC_X_DIM // 2  # in 1:GC_X_DIM
    gcY = GC_Y_DIM // 2  # in 1:GC_Y_DIM
    gcZ = GC_Z_DIM // 2  # in 1:GC_Z_DIM

    # You can set fixed values for gcX, gcY, and gcZ like this:
    # gcX = 0
    # gcY = 0
    # gcZ = 0

    return gcX, gcY, gcZ


# Key changes:

#     Floor operation: In Python, // is used for integer division (like MATLAB's floor division).
#     Global variables: Global variables GC_X_DIM, GC_Y_DIM, and GC_Z_DIM are assumed to be set elsewhere in the program.
#     Return: The function returns the values gcX, gcY, and gcZ as a tuple, just like in MATLAB.

# This should now work in Python assuming you have initialized GC_X_DIM, GC_Y_DIM, and GC_Z_DIM elsewhere in the code.
