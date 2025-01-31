import numpy as np


def yaw_height_hdc_initial(*args):
    global YAW_HEIGHT_HDC
    global YAW_HEIGHT_HDC_Y_DIM
    global YAW_HEIGHT_HDC_H_DIM
    global YAW_HEIGHT_HDC_EXCIT_Y_DIM
    global YAW_HEIGHT_HDC_EXCIT_H_DIM
    global YAW_HEIGHT_HDC_INHIB_Y_DIM
    global YAW_HEIGHT_HDC_INHIB_H_DIM
    global YAW_HEIGHT_HDC_GLOBAL_INHIB
    global YAW_HEIGHT_HDC_VT_INJECT_ENERGY
    global YAW_HEIGHT_HDC_EXCIT_Y_VAR
    global YAW_HEIGHT_HDC_EXCIT_H_VAR
    global YAW_HEIGHT_HDC_INHIB_Y_VAR
    global YAW_HEIGHT_HDC_INHIB_H_VAR
    global YAW_ROT_V_SCALE
    global HEIGHT_V_SCALE
    global YAW_HEIGHT_HDC_PACKET_SIZE

    # Process the parameters
    for i in range(0, len(args) - 1, 2):
        if isinstance(args[i], str):
            param_name = args[i]
            param_value = args[i + 1]
            if param_name == "YAW_HEIGHT_HDC_Y_DIM":
                YAW_HEIGHT_HDC_Y_DIM = param_value
            elif param_name == "YAW_HEIGHT_HDC_H_DIM":
                YAW_HEIGHT_HDC_H_DIM = param_value
            elif param_name == "YAW_HEIGHT_HDC_EXCIT_Y_DIM":
                YAW_HEIGHT_HDC_EXCIT_Y_DIM = param_value
            elif param_name == "YAW_HEIGHT_HDC_EXCIT_H_DIM":
                YAW_HEIGHT_HDC_EXCIT_H_DIM = param_value
            elif param_name == "YAW_HEIGHT_HDC_INHIB_Y_DIM":
                YAW_HEIGHT_HDC_INHIB_Y_DIM = param_value
            elif param_name == "YAW_HEIGHT_HDC_INHIB_H_DIM":
                YAW_HEIGHT_HDC_INHIB_H_DIM = param_value
            elif param_name == "YAW_HEIGHT_HDC_EXCIT_Y_VAR":
                YAW_HEIGHT_HDC_EXCIT_Y_VAR = param_value
            elif param_name == "YAW_HEIGHT_HDC_EXCIT_H_VAR":
                YAW_HEIGHT_HDC_EXCIT_H_VAR = param_value
            elif param_name == "YAW_HEIGHT_HDC_INHIB_Y_VAR":
                YAW_HEIGHT_HDC_INHIB_Y_VAR = param_value
            elif param_name == "YAW_HEIGHT_HDC_INHIB_H_VAR":
                YAW_HEIGHT_HDC_INHIB_H_VAR = param_value
            elif param_name == "YAW_HEIGHT_HDC_GLOBAL_INHIB":
                YAW_HEIGHT_HDC_GLOBAL_INHIB = param_value
            elif param_name == "YAW_HEIGHT_HDC_VT_INJECT_ENERGY":
                YAW_HEIGHT_HDC_VT_INJECT_ENERGY = param_value
            elif param_name == "YAW_ROT_V_SCALE":
                YAW_ROT_V_SCALE = param_value
            elif param_name == "HEIGHT_V_SCALE":
                HEIGHT_V_SCALE = param_value
            elif param_name == "YAW_HEIGHT_HDC_PACKET_SIZE":
                YAW_HEIGHT_HDC_PACKET_SIZE = param_value

    # The weight of excitation in yaw_height_hdc network
    global YAW_HEIGHT_HDC_EXCIT_WEIGHT
    YAW_HEIGHT_HDC_EXCIT_WEIGHT = create_yaw_height_hdc_weights(
        YAW_HEIGHT_HDC_EXCIT_Y_DIM,
        YAW_HEIGHT_HDC_EXCIT_H_DIM,
        YAW_HEIGHT_HDC_EXCIT_Y_VAR,
        YAW_HEIGHT_HDC_EXCIT_H_VAR,
    )

    # The weight of inhibition in yaw_height_hdc network
    global YAW_HEIGHT_HDC_INHIB_WEIGHT
    YAW_HEIGHT_HDC_INHIB_WEIGHT = create_yaw_height_hdc_weights(
        YAW_HEIGHT_HDC_INHIB_Y_DIM,
        YAW_HEIGHT_HDC_INHIB_H_DIM,
        YAW_HEIGHT_HDC_INHIB_Y_VAR,
        YAW_HEIGHT_HDC_INHIB_H_VAR,
    )

    # Convenience constants
    global YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF
    global YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF
    global YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF
    global YAW_HEIGHT_HDC_INHIB_H_DIM_HALF

    YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF = YAW_HEIGHT_HDC_EXCIT_Y_DIM // 2
    YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF = YAW_HEIGHT_HDC_EXCIT_H_DIM // 2
    YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF = YAW_HEIGHT_HDC_INHIB_Y_DIM // 2
    YAW_HEIGHT_HDC_INHIB_H_DIM_HALF = YAW_HEIGHT_HDC_INHIB_H_DIM // 2

    # The yaw theta size of each unit in radians
    global YAW_HEIGHT_HDC_Y_TH_SIZE
    YAW_HEIGHT_HDC_Y_TH_SIZE = (2 * np.pi) / YAW_HEIGHT_HDC_Y_DIM

    # The height theta size of each unit in radians
    global YAW_HEIGHT_HDC_H_SIZE
    YAW_HEIGHT_HDC_H_SIZE = (2 * np.pi) / YAW_HEIGHT_HDC_H_DIM

    # Lookup tables for finding the center of the HD cells in the YAW_HEIGHT_HDC
    global YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP
    global YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP
    global YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP
    global YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP

    YAW_HEIGHT_HDC_Y_SUM_SIN_LOOKUP = np.sin(
        np.arange(1, YAW_HEIGHT_HDC_Y_DIM + 1) * YAW_HEIGHT_HDC_Y_TH_SIZE
    )
    YAW_HEIGHT_HDC_Y_SUM_COS_LOOKUP = np.cos(
        np.arange(1, YAW_HEIGHT_HDC_Y_DIM + 1) * YAW_HEIGHT_HDC_Y_TH_SIZE
    )

    YAW_HEIGHT_HDC_H_SUM_SIN_LOOKUP = np.sin(
        np.arange(1, YAW_HEIGHT_HDC_H_DIM + 1) * YAW_HEIGHT_HDC_H_SIZE
    )
    YAW_HEIGHT_HDC_H_SUM_COS_LOOKUP = np.cos(
        np.arange(1, YAW_HEIGHT_HDC_H_DIM + 1) * YAW_HEIGHT_HDC_H_SIZE
    )

    # The wrap for excitation in yaw and height in yaw_height_hdc network
    global YAW_HEIGHT_HDC_EXCIT_Y_WRAP
    global YAW_HEIGHT_HDC_EXCIT_H_WRAP
    global YAW_HEIGHT_HDC_INHIB_Y_WRAP
    global YAW_HEIGHT_HDC_INHIB_H_WRAP
    global YAW_HEIGHT_HDC_MAX_Y_WRAP
    global YAW_HEIGHT_HDC_MAX_H_WRAP

    YAW_HEIGHT_HDC_EXCIT_Y_WRAP = np.concatenate(
        [
            np.arange(
                YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF,
                YAW_HEIGHT_HDC_Y_DIM,
            ),
            np.arange(0, YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_EXCIT_Y_DIM_HALF),
        ]
    )

    YAW_HEIGHT_HDC_EXCIT_H_WRAP = np.concatenate(
        [
            np.arange(
                YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF,
                YAW_HEIGHT_HDC_H_DIM,
            ),
            np.arange(0, YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_EXCIT_H_DIM_HALF),
        ]
    )

    YAW_HEIGHT_HDC_INHIB_Y_WRAP = np.concatenate(
        [
            np.arange(
                YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF,
                YAW_HEIGHT_HDC_Y_DIM,
            ),
            np.arange(0, YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_INHIB_Y_DIM_HALF),
        ]
    )

    YAW_HEIGHT_HDC_INHIB_H_WRAP = np.concatenate(
        [
            np.arange(
                YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_INHIB_H_DIM_HALF,
                YAW_HEIGHT_HDC_H_DIM,
            ),
            np.arange(0, YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_INHIB_H_DIM_HALF),
        ]
    )

    YAW_HEIGHT_HDC_MAX_Y_WRAP = np.concatenate(
        [
            np.arange(
                YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_PACKET_SIZE, YAW_HEIGHT_HDC_Y_DIM
            ),
            np.arange(0, YAW_HEIGHT_HDC_Y_DIM - YAW_HEIGHT_HDC_PACKET_SIZE),
        ]
    )

    YAW_HEIGHT_HDC_MAX_H_WRAP = np.concatenate(
        [
            np.arange(
                YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_PACKET_SIZE, YAW_HEIGHT_HDC_H_DIM
            ),
            np.arange(0, YAW_HEIGHT_HDC_H_DIM - YAW_HEIGHT_HDC_PACKET_SIZE),
        ]
    )

    # Set the initial position in the HD cell network
    curYawTheta, curHeight = get_hdc_initial_value()

    # Initialize the YAW_HEIGHT_HDC array
    YAW_HEIGHT_HDC = np.zeros((YAW_HEIGHT_HDC_Y_DIM, YAW_HEIGHT_HDC_H_DIM))
    YAW_HEIGHT_HDC[curYawTheta, curHeight] = 1

    global MAX_ACTIVE_YAW_HEIGHT_HIS_PATH
    MAX_ACTIVE_YAW_HEIGHT_HIS_PATH = np.array([curYawTheta, curHeight])


# Key Changes and Explanations:

#     Global Variables:
#         Just like in MATLAB, global variables are used in Python to access variables that are defined outside the function. In Python, these are accessed via global <var_name>.

#     Argument Parsing:
#         MATLAB uses varargin to handle variable-length input arguments. In Python, this is done using *args. The arguments are processed by looping through args and checking if they are strings (which represent the parameter names).

#     Parameter Assignment:
#         The same logic as in MATLAB is used for assigning values to global variables based on the input arguments.

#     NumPy Arrays:
#         For array-based operations (like creating weight matrices and generating wrap arrays), NumPy is used to handle the array manipulations efficiently.

#     Weight Matrix Creation:
#         The create_yaw_height_hdc_weights function is assumed to be defined elsewhere, as in the original MATLAB code.

#     Lookup Tables:
#         Similar to MATLAB’s sin and cos lookup tables, Python uses np.sin and np.cos to generate these arrays.

#     Matrix Wrapping:
#         The "wrap" logic for excitation, inhibition, and maximum activity packet is handled by NumPy's np.concatenate() to create the required wrap arrays.

# Assumptions:

#     The get_hdc_initial_value() function is assumed to be implemented elsewhere in the code to return the initial position.
#     The create_yaw_height_hdc_weights() function should also be implemented elsewhere to return the correct weight matrices.
