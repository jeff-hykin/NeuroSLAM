import numpy as np


def visual_odo_initial(*args):
    global ODO_IMG_TRANS_Y_RANGE
    global ODO_IMG_TRANS_X_RANGE
    global ODO_IMG_HEIGHT_V_Y_RANGE
    global ODO_IMG_HEIGHT_V_X_RANGE
    global ODO_IMG_YAW_ROT_Y_RANGE
    global ODO_IMG_YAW_ROT_X_RANGE
    global ODO_IMG_TRANS_RESIZE_RANGE
    global ODO_IMG_YAW_ROT_RESIZE_RANGE
    global ODO_IMG_HEIGHT_V_RESIZE_RANGE
    global ODO_TRANS_V_SCALE
    global ODO_YAW_ROT_V_SCALE
    global ODO_HEIGHT_V_SCALE
    global MAX_TRANS_V_THRESHOLD
    global MAX_YAW_ROT_V_THRESHOLD
    global MAX_HEIGHT_V_THRESHOLD
    global ODO_SHIFT_MATCH_VERT
    global ODO_SHIFT_MATCH_HORI
    global FOV_HORI_DEGREE
    global FOV_VERT_DEGREE
    global KEY_POINT_SET
    global ODO_STEP

    # Process the parameters (input args)
    i = 0
    while i < len(args) - 1:
        if isinstance(args[i], str):
            param_name = args[i]
            param_value = args[i + 1]
            if param_name == "ODO_IMG_TRANS_Y_RANGE":
                ODO_IMG_TRANS_Y_RANGE = param_value
            elif param_name == "ODO_IMG_TRANS_X_RANGE":
                ODO_IMG_TRANS_X_RANGE = param_value
            elif param_name == "ODO_IMG_HEIGHT_V_Y_RANGE":
                ODO_IMG_HEIGHT_V_Y_RANGE = param_value
            elif param_name == "ODO_IMG_HEIGHT_V_X_RANGE":
                ODO_IMG_HEIGHT_V_X_RANGE = param_value
            elif param_name == "ODO_IMG_YAW_ROT_Y_RANGE":
                ODO_IMG_YAW_ROT_Y_RANGE = param_value
            elif param_name == "ODO_IMG_YAW_ROT_X_RANGE":
                ODO_IMG_YAW_ROT_X_RANGE = param_value
            elif param_name == "ODO_IMG_TRANS_RESIZE_RANGE":
                ODO_IMG_TRANS_RESIZE_RANGE = param_value
            elif param_name == "ODO_IMG_YAW_ROT_RESIZE_RANGE":
                ODO_IMG_YAW_ROT_RESIZE_RANGE = param_value
            elif param_name == "ODO_IMG_HEIGHT_V_RESIZE_RANGE":
                ODO_IMG_HEIGHT_V_RESIZE_RANGE = param_value
            elif param_name == "ODO_TRANS_V_SCALE":
                ODO_TRANS_V_SCALE = param_value
            elif param_name == "ODO_YAW_ROT_V_SCALE":
                ODO_YAW_ROT_V_SCALE = param_value
            elif param_name == "ODO_HEIGHT_V_SCALE":
                ODO_HEIGHT_V_SCALE = param_value
            elif param_name == "MAX_TRANS_V_THRESHOLD":
                MAX_TRANS_V_THRESHOLD = param_value
            elif param_name == "MAX_YAW_ROT_V_THRESHOLD":
                MAX_YAW_ROT_V_THRESHOLD = param_value
            elif param_name == "MAX_HEIGHT_V_THRESHOLD":
                MAX_HEIGHT_V_THRESHOLD = param_value
            elif param_name == "ODO_SHIFT_MATCH_HORI":
                ODO_SHIFT_MATCH_HORI = param_value
            elif param_name == "ODO_SHIFT_MATCH_VERT":
                ODO_SHIFT_MATCH_VERT = param_value
            elif param_name == "FOV_HORI_DEGREE":
                FOV_HORI_DEGREE = param_value
            elif param_name == "FOV_VERT_DEGREE":
                FOV_VERT_DEGREE = param_value
            elif param_name == "KEY_POINT_SET":
                KEY_POINT_SET = param_value
            elif param_name == "ODO_STEP":
                ODO_STEP = param_value
        i += 2

    # Initialize sums for previous image intensities (1D arrays for each image)
    global PREV_TRANS_V_IMG_X_SUMS
    global PREV_YAW_ROT_V_IMG_X_SUMS
    global PREV_HEIGHT_V_IMG_Y_SUMS

    PREV_YAW_ROT_V_IMG_X_SUMS = np.zeros((1, ODO_IMG_TRANS_RESIZE_RANGE[1]))
    PREV_HEIGHT_V_IMG_Y_SUMS = np.zeros((ODO_IMG_HEIGHT_V_RESIZE_RANGE[0], 1))
    PREV_TRANS_V_IMG_X_SUMS = np.zeros(
        (1, ODO_IMG_TRANS_RESIZE_RANGE[1] - ODO_SHIFT_MATCH_HORI)
    )

    # Initialize previous velocity values to maintain stable speed
    global PREV_TRANS_V
    global PREV_YAW_ROT_V
    global PREV_HEIGHT_V

    PREV_TRANS_V = 0.025
    PREV_YAW_ROT_V = 0
    PREV_HEIGHT_V = 0

    # End of initialization for visual odometry


# Key Changes and Explanations:

#     Global Variables:
#         In Python, global variables are declared using the global keyword just like in the MATLAB version. These are used throughout the function.

#     Argument Processing:
#         MATLAB uses varargin to handle variable-length arguments, while in Python, we use *args.
#         The function loops through args, checking if each element is a string (the parameter name). If it's a string, the corresponding global variable is updated with the value found right after the string.

#     Parameter Assignment:
#         The switch case in MATLAB is replaced with if-elif statements in Python to check the parameter names and assign their corresponding values to the global variables.

#     NumPy Arrays:
#         NumPy is used to initialize arrays for the sum of intensities from the previous images (PREV_TRANS_V_IMG_X_SUMS, PREV_YAW_ROT_V_IMG_X_SUMS, and PREV_HEIGHT_V_IMG_Y_SUMS).

#     Array Initialization:
#         The previous image sums are initialized using NumPy’s np.zeros(), which creates arrays of zeros of the specified shape.

#     Velocity Initialization:
#         The PREV_TRANS_V, PREV_YAW_ROT_V, and PREV_HEIGHT_V variables are initialized to certain values to maintain stable velocity during the odometry process.

# Assumptions:

#     Input Arguments: The function accepts named arguments as key-value pairs, just like in MATLAB. For example: visual_odo_initial('ODO_IMG_TRANS_Y_RANGE', [1, 10], 'ODO_IMG_YAW_ROT_X_RANGE', [0, 5]).
#     NumPy Arrays: ODO_IMG_TRANS_RESIZE_RANGE, ODO_IMG_HEIGHT_V_RESIZE_RANGE, etc., are expected to be lists or tuples representing the size of the respective images.
