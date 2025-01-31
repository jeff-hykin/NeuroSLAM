import numpy as np


def gc_initial(*args):
    global GRIDCELLS
    global GC_X_DIM, GC_Y_DIM, GC_Z_DIM
    global GC_EXCIT_X_DIM, GC_EXCIT_Y_DIM, GC_EXCIT_Z_DIM
    global GC_INHIB_X_DIM, GC_INHIB_Y_DIM, GC_INHIB_Z_DIM
    global GC_GLOBAL_INHIB
    global GC_VT_INJECT_ENERGY
    global GC_EXCIT_X_VAR, GC_EXCIT_Y_VAR, GC_EXCIT_Z_VAR
    global GC_INHIB_X_VAR, GC_INHIB_Y_VAR, GC_INHIB_Z_VAR
    global GC_HORI_TRANS_V_SCALE, GC_VERT_TRANS_V_SCALE
    global GC_PACKET_SIZE

    # Process the parameters (args corresponds to varargin in MATLAB)
    i = 0
    while i < len(args) - 1:
        if isinstance(args[i], str):
            param = args[i]
            value = args[i + 1]
            if param == "GC_X_DIM":
                GC_X_DIM = value
            elif param == "GC_Y_DIM":
                GC_Y_DIM = value
            elif param == "GC_Z_DIM":
                GC_Z_DIM = value
            elif param == "GC_EXCIT_X_DIM":
                GC_EXCIT_X_DIM = value
            elif param == "GC_EXCIT_Y_DIM":
                GC_EXCIT_Y_DIM = value
            elif param == "GC_EXCIT_Z_DIM":
                GC_EXCIT_Z_DIM = value
            elif param == "GC_INHIB_X_DIM":
                GC_INHIB_X_DIM = value
            elif param == "GC_INHIB_Y_DIM":
                GC_INHIB_Y_DIM = value
            elif param == "GC_INHIB_Z_DIM":
                GC_INHIB_Z_DIM = value
            elif param == "GC_EXCIT_X_VAR":
                GC_EXCIT_X_VAR = value
            elif param == "GC_EXCIT_Y_VAR":
                GC_EXCIT_Y_VAR = value
            elif param == "GC_EXCIT_Z_VAR":
                GC_EXCIT_Z_VAR = value
            elif param == "GC_INHIB_X_VAR":
                GC_INHIB_X_VAR = value
            elif param == "GC_INHIB_Y_VAR":
                GC_INHIB_Y_VAR = value
            elif param == "GC_INHIB_Z_VAR":
                GC_INHIB_Z_VAR = value
            elif param == "GC_GLOBAL_INHIB":
                GC_GLOBAL_INHIB = value
            elif param == "GC_VT_INJECT_ENERGY":
                GC_VT_INJECT_ENERGY = value
            elif param == "GC_HORI_TRANS_V_SCALE":
                GC_HORI_TRANS_V_SCALE = value
            elif param == "GC_VERT_TRANS_V_SCALE":
                GC_VERT_TRANS_V_SCALE = value
            elif param == "GC_PACKET_SIZE":
                GC_PACKET_SIZE = value
        i += 2

    # Create the weight matrices for excitation and inhibition
    global GC_EXCIT_WEIGHT
    GC_EXCIT_WEIGHT = create_gc_weights(
        GC_EXCIT_X_DIM,
        GC_EXCIT_Y_DIM,
        GC_EXCIT_Z_DIM,
        GC_EXCIT_X_VAR,
        GC_EXCIT_Y_VAR,
        GC_EXCIT_Z_VAR,
    )

    global GC_INHIB_WEIGHT
    GC_INHIB_WEIGHT = create_gc_weights(
        GC_INHIB_X_DIM,
        GC_INHIB_Y_DIM,
        GC_INHIB_Z_DIM,
        GC_INHIB_X_VAR,
        GC_INHIB_Y_VAR,
        GC_INHIB_Z_VAR,
    )

    # Convenience constants for half dimensions
    global GC_EXCIT_X_DIM_HALF, GC_EXCIT_Y_DIM_HALF, GC_EXCIT_Z_DIM_HALF
    global GC_INHIB_X_DIM_HALF, GC_INHIB_Y_DIM_HALF, GC_INHIB_Z_DIM_HALF

    GC_EXCIT_X_DIM_HALF = GC_EXCIT_X_DIM // 2
    GC_EXCIT_Y_DIM_HALF = GC_EXCIT_Y_DIM // 2
    GC_EXCIT_Z_DIM_HALF = GC_EXCIT_Z_DIM // 2

    GC_INHIB_X_DIM_HALF = GC_INHIB_X_DIM // 2
    GC_INHIB_Y_DIM_HALF = GC_INHIB_Y_DIM // 2
    GC_INHIB_Z_DIM_HALF = GC_INHIB_Z_DIM // 2

    # Wraps for excitation and inhibition
    global GC_EXCIT_X_WRAP, GC_EXCIT_Y_WRAP, GC_EXCIT_Z_WRAP
    global GC_INHIB_X_WRAP, GC_INHIB_Y_WRAP, GC_INHIB_Z_WRAP

    GC_EXCIT_X_WRAP = np.concatenate(
        [
            np.arange(GC_X_DIM - GC_EXCIT_X_DIM_HALF, GC_X_DIM),
            np.arange(0, GC_EXCIT_X_DIM_HALF),
        ]
    )
    GC_EXCIT_Y_WRAP = np.concatenate(
        [
            np.arange(GC_Y_DIM - GC_EXCIT_Y_DIM_HALF, GC_Y_DIM),
            np.arange(0, GC_EXCIT_Y_DIM_HALF),
        ]
    )
    GC_EXCIT_Z_WRAP = np.concatenate(
        [
            np.arange(GC_Z_DIM - GC_EXCIT_Z_DIM_HALF, GC_Z_DIM),
            np.arange(0, GC_EXCIT_Z_DIM_HALF),
        ]
    )

    GC_INHIB_X_WRAP = np.concatenate(
        [
            np.arange(GC_X_DIM - GC_INHIB_X_DIM_HALF, GC_X_DIM),
            np.arange(0, GC_INHIB_X_DIM_HALF),
        ]
    )
    GC_INHIB_Y_WRAP = np.concatenate(
        [
            np.arange(GC_Y_DIM - GC_INHIB_Y_DIM_HALF, GC_Y_DIM),
            np.arange(0, GC_INHIB_Y_DIM_HALF),
        ]
    )
    GC_INHIB_Z_WRAP = np.concatenate(
        [
            np.arange(GC_Z_DIM - GC_INHIB_Z_DIM_HALF, GC_Z_DIM),
            np.arange(0, GC_INHIB_Z_DIM_HALF),
        ]
    )

    # Cell size (theta size) for each unit in radians
    global GC_X_TH_SIZE, GC_Y_TH_SIZE, GC_Z_TH_SIZE

    GC_X_TH_SIZE = 2 * np.pi / GC_X_DIM
    GC_Y_TH_SIZE = 2 * np.pi / GC_Y_DIM
    GC_Z_TH_SIZE = 2 * np.pi / GC_Z_DIM

    # Lookup tables for sine and cosine of theta values
    global GC_X_SUM_SIN_LOOKUP, GC_X_SUM_COS_LOOKUP
    global GC_Y_SUM_SIN_LOOKUP, GC_Y_SUM_COS_LOOKUP
    global GC_Z_SUM_SIN_LOOKUP, GC_Z_SUM_COS_LOOKUP

    GC_X_SUM_SIN_LOOKUP = np.sin(np.arange(GC_X_DIM) * GC_X_TH_SIZE)
    GC_X_SUM_COS_LOOKUP = np.cos(np.arange(GC_X_DIM) * GC_X_TH_SIZE)

    GC_Y_SUM_SIN_LOOKUP = np.sin(np.arange(GC_Y_DIM) * GC_Y_TH_SIZE)
    GC_Y_SUM_COS_LOOKUP = np.cos(np.arange(GC_Y_DIM) * GC_Y_TH_SIZE)

    GC_Z_SUM_SIN_LOOKUP = np.sin(np.arange(GC_Z_DIM) * GC_Z_TH_SIZE)
    GC_Z_SUM_COS_LOOKUP = np.cos(np.arange(GC_Z_DIM) * GC_Z_TH_SIZE)

    # Wrap for maximum activity packet
    global GC_MAX_X_WRAP, GC_MAX_Y_WRAP, GC_MAX_Z_WRAP

    GC_MAX_X_WRAP = np.concatenate(
        [np.arange(GC_X_DIM - GC_PACKET_SIZE, GC_X_DIM), np.arange(0, GC_PACKET_SIZE)]
    )
    GC_MAX_Y_WRAP = np.concatenate(
        [np.arange(GC_Y_DIM - GC_PACKET_SIZE, GC_Y_DIM), np.arange(0, GC_PACKET_SIZE)]
    )
    GC_MAX_Z_WRAP = np.concatenate(
        [np.arange(GC_Z_DIM - GC_PACKET_SIZE, GC_Z_DIM), np.arange(0, GC_PACKET_SIZE)]
    )

    # Set initial position in the grid cell network
    gcX, gcY, gcZ = get_gc_initial_pos()

    # Initialize GRIDCELLS
    GRIDCELLS = np.zeros((GC_X_DIM, GC_Y_DIM, GC_Z_DIM))
    GRIDCELLS[gcX, gcY, gcZ] = 1

    # Maximum active position path
    global MAX_ACTIVE_XYZ_PATH
    MAX_ACTIVE_XYZ_PATH = [gcX, gcY, gcZ]


# Explanation of Changes:

#     Handling Input Parameters:
#         In MATLAB, varargin allows the passing of a variable number of input arguments. In Python, we use *args to capture the variable-length argument list.
#         A loop iterates through the provided arguments, where each argument is processed and assigned to the corresponding global variable.

#     Creating Weight Matrices:
#         The function create_gc_weights is assumed to be defined elsewhere (just like in MATLAB). This function takes the excitation/inhibition matrix dimensions and their variances as parameters.

#     Wrapping Indexes:
#         The wrapping logic for the excitation and inhibition arrays uses np.concatenate to combine two ranges: one for the upper portion and one for the lower portion of the grid.

#     Global Variables:
#         Global variables are handled by using global <variable_name> inside the function. All the parameters that are modified or accessed within the function need to be declared global.

#     Using NumPy:
#         For array and matrix operations, NumPy is used to replicate MATLAB's matrix indexing and operations like np.arange, np.sin, np.cos, and slicing.

#     Initial Position and Grid Setup:
#         The grid initialization (GRIDCELLS) is done using NumPy's np.zeros. The get_gc_initial_pos function is assumed to return the initial position as gcX, gcY, `gcZ
