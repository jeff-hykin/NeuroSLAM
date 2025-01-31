import numpy as np
import cv2

# TODO: import compare_segments


def visual_odometry_up(raw_img):
    """
    Simple visual odometry with scanline intensity profile algorithm.
    Returns horizontal translational velocity, rotational velocity, and vertical translational velocity (height change).

    Parameters:
        raw_img (numpy.ndarray): The input image (grayscale).

    Returns:
        tuple: (transV, yawRotV, heightV) representing the translational, yaw rotational, and vertical velocity.
    """
    # Define constants (these would typically be set globally or passed as parameters)
    ODO_SHIFT_MATCH_HORI = 10  # Example threshold, actual values should be provided
    ODO_YAW_ROT_V_SCALE = 0.1
    ODO_TRANS_V_SCALE = 0.1
    ODO_HEIGHT_V_SCALE = 0.1
    MAX_TRANS_V_THRESHOLD = 1.0
    MAX_YAW_ROT_V_THRESHOLD = 1.0
    MAX_HEIGHT_V_THRESHOLD = 1.0
    FOV_HORI_DEGREE = 60.0  # Horizontal field of view in degrees
    FOV_VERT_DEGREE = 40.0  # Vertical field of view in degrees

    # Initialize global variables (or they could be passed in)
    global PREV_TRANS_V_IMG_X_SUMS, PREV_YAW_ROT_V_IMG_X_SUMS, PREV_HEIGHT_V_IMG_Y_SUMS
    global PREV_TRANS_V, PREV_YAW_ROT_V, PREV_HEIGHT_V

    # Initialize global variables if they are not set yet
    if "PREV_TRANS_V" not in globals():
        PREV_TRANS_V = 0
        PREV_YAW_ROT_V = 0
        PREV_HEIGHT_V = 0
        PREV_TRANS_V_IMG_X_SUMS = np.zeros(raw_img.shape[1])
        PREV_YAW_ROT_V_IMG_X_SUMS = np.zeros(raw_img.shape[1])
        PREV_HEIGHT_V_IMG_Y_SUMS = np.zeros(raw_img.shape[0])

    # Compute yaw (rotational velocity)
    sub_raw_img = raw_img[10:100, 20:200]  # Example sub-image range
    sub_raw_img_resized = cv2.resize(sub_raw_img, (100, 100))  # Resize the sub-image
    hori_deg_per_pixel = FOV_HORI_DEGREE / sub_raw_img_resized.shape[1]

    img_x_sums = np.sum(sub_raw_img_resized, axis=0)
    avg_intensity = np.sum(img_x_sums) / img_x_sums.size
    img_x_sums = img_x_sums / avg_intensity  # Normalize

    min_offset_yaw_rot, min_diff_intensity_rot = compare_segments(
        img_x_sums, PREV_YAW_ROT_V_IMG_X_SUMS, ODO_SHIFT_MATCH_HORI, img_x_sums.size
    )

    yaw_rot_v = (
        ODO_YAW_ROT_V_SCALE * min_offset_yaw_rot * hori_deg_per_pixel
    )  # in degrees

    if abs(yaw_rot_v) > MAX_YAW_ROT_V_THRESHOLD:
        yaw_rot_v = PREV_YAW_ROT_V
    else:
        PREV_YAW_ROT_V = yaw_rot_v

    PREV_YAW_ROT_V_IMG_X_SUMS = img_x_sums
    PREV_TRANS_V_IMG_X_SUMS = img_x_sums

    # Compute translational velocity
    trans_v = min_diff_intensity_rot * ODO_TRANS_V_SCALE
    if trans_v > MAX_TRANS_V_THRESHOLD:
        trans_v = PREV_TRANS_V
    else:
        PREV_TRANS_V = trans_v

    # Compute height (vertical) velocity
    sub_raw_img = raw_img[100:200, 50:150]  # Example vertical range
    sub_raw_img_resized = cv2.resize(sub_raw_img, (100, 100))  # Resize the sub-image
    vert_deg_per_pixel = FOV_VERT_DEGREE / sub_raw_img_resized.shape[0]

    if min_offset_yaw_rot > 0:
        sub_raw_img_resized = sub_raw_img_resized[:, min_offset_yaw_rot:]
    else:
        sub_raw_img_resized = sub_raw_img_resized[:, :-min_offset_yaw_rot]

    image_y_sums = np.sum(sub_raw_img_resized, axis=1)
    avg_intensity = np.sum(image_y_sums) / image_y_sums.size
    image_y_sums = image_y_sums / avg_intensity  # Normalize

    min_offset_height_v, min_diff_intensity_height = compare_segments(
        image_y_sums, PREV_HEIGHT_V_IMG_Y_SUMS, ODO_SHIFT_MATCH_HORI, image_y_sums.size
    )

    if min_offset_height_v < 0:
        min_diff_intensity_height = -min_diff_intensity_height

    height_v = (
        ODO_HEIGHT_V_SCALE * min_diff_intensity_height if min_offset_height_v > 0 else 0
    )

    if abs(height_v) > MAX_HEIGHT_V_THRESHOLD:
        height_v = PREV_HEIGHT_V
    else:
        PREV_HEIGHT_V = height_v

    PREV_HEIGHT_V_IMG_Y_SUMS = image_y_sums

    return trans_v, yaw_rot_v, height_v


# Key Changes:

#     Image Processing:
#         The image slicing and resizing are handled using cv2.resize for consistency with the MATLAB imresize function.
#         The code uses np.sum to calculate the intensity sums along columns (img_x_sums) or rows (image_y_sums), which is equivalent to the MATLAB sum function.

#     Global Variables:
#         The global variables like PREV_TRANS_V, PREV_YAW_ROT_V, etc., are initialized if they are not already set. This ensures the function doesn't rely on previous states being explicitly initialized.

#     Yaw, Translational, and Height Velocity Calculation:
#         The yaw_rot_v (rotational velocity) is calculated based on the shift offset returned from compare_segments. The translational velocity (trans_v) is scaled similarly, and the height (height_v) is determined from vertical intensity profiles.

#     Threshold Checks:
#         The calculated velocities are capped at predefined thresholds (MAX_TRANS_V_THRESHOLD, MAX_YAW_ROT_V_THRESHOLD, MAX_HEIGHT_V_THRESHOLD). If the velocity exceeds the threshold, it is kept as the previous value to maintain stability.

# Example Usage:

# Here’s an example of how you could use the function:

# # Example raw image (grayscale)
# raw_img = np.random.rand(200, 200)  # Replace with actual image

# # Call the visual_odometry_up function
# trans_v, yaw_rot_v, height_v = visual_odometry_up(raw_img)

# # Output the results
# print(f"Translational Velocity: {trans_v}")
# print(f"Yaw Rotational Velocity: {yaw_rot_v}")
# print(f"Height Velocity: {height_v}")

# Additional Notes:

#     The function compare_segments is reused to compute the offsets and differences between consecutive frames for both yaw rotation and height velocity.
#     The constants like ODO_SHIFT_MATCH_HORI and scaling factors (ODO_TRANS_V_SCALE, ODO_YAW_ROT_V_SCALE, etc.) should be defined based on your system's calibration or passed into the function as parameters.
