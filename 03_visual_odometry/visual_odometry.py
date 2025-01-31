import numpy as np
import cv2  # OpenCV for image resizing


def visual_odometry(raw_img):
    # Global variables (must be declared before use)
    global SUB_TRANS_IMG
    global SUB_YAW_ROT_IMG
    global SUB_HEIGHT_V_IMG
    global ODO_IMG_HEIGHT_V_Y_RANGE
    global ODO_IMG_YAW_ROT_Y_RANGE
    global ODO_IMG_YAW_ROT_X_RANGE
    global ODO_IMG_HEIGHT_V_X_RANGE
    global ODO_IMG_TRANS_Y_RANGE
    global ODO_IMG_TRANS_X_RANGE
    global ODO_IMG_YAW_ROT_RESIZE_RANGE
    global ODO_IMG_HEIGHT_V_RESIZE_RANGE
    global ODO_IMG_TRANS_RESIZE_RANGE
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
    global PREV_TRANS_V_IMG_X_SUMS
    global PREV_YAW_ROT_V_IMG_X_SUMS
    global PREV_HEIGHT_V_IMG_Y_SUMS
    global PREV_TRANS_V
    global PREV_YAW_ROT_V
    global PREV_HEIGHT_V
    global DEGREE_TO_RADIAN
    global OFFSET_YAW_ROT
    global OFFSET_HEIGHT_V

    # Start to compute horizontal rotational velocity (yaw)
    sub_raw_img = raw_img[
        ODO_IMG_YAW_ROT_Y_RANGE[0] : ODO_IMG_YAW_ROT_Y_RANGE[1],
        ODO_IMG_YAW_ROT_X_RANGE[0] : ODO_IMG_YAW_ROT_X_RANGE[1],
    ]
    sub_raw_img = cv2.resize(sub_raw_img, tuple(ODO_IMG_YAW_ROT_RESIZE_RANGE))
    hori_deg_per_pixel = FOV_HORI_DEGREE / sub_raw_img.shape[1]

    SUB_YAW_ROT_IMG = sub_raw_img
    SUB_TRANS_IMG = sub_raw_img

    # Get the x_sum of average intensity values in every column of image
    img_x_sums = np.sum(sub_raw_img, axis=0)
    avg_intensity = np.sum(img_x_sums) / img_x_sums.size
    img_x_sums = img_x_sums / avg_intensity

    # Compare the current image with the previous image (use compare_segments function)
    min_offset_yaw_rot, min_diff_intensity_rot = compare_segments(
        img_x_sums, PREV_YAW_ROT_V_IMG_X_SUMS, ODO_SHIFT_MATCH_HORI, img_x_sums.size
    )

    OFFSET_YAW_ROT = min_offset_yaw_rot
    yaw_rot_v = (
        ODO_YAW_ROT_V_SCALE * min_offset_yaw_rot * hori_deg_per_pixel
    )  # in degrees

    # Check if yaw rotation velocity exceeds max threshold
    if abs(yaw_rot_v) > MAX_YAW_ROT_V_THRESHOLD:
        yaw_rot_v = PREV_YAW_ROT_V
    else:
        PREV_YAW_ROT_V = yaw_rot_v

    PREV_YAW_ROT_V_IMG_X_SUMS = img_x_sums
    PREV_TRANS_V_IMG_X_SUMS = img_x_sums

    # Compute the translational velocity (translation in x direction)
    trans_v = min_diff_intensity_rot * ODO_TRANS_V_SCALE

    if trans_v > MAX_TRANS_V_THRESHOLD:
        trans_v = PREV_TRANS_V
    else:
        PREV_TRANS_V = trans_v

    # Start to compute the height change velocity (pitch)
    sub_raw_img = raw_img[
        ODO_IMG_HEIGHT_V_Y_RANGE[0] : ODO_IMG_HEIGHT_V_Y_RANGE[1],
        ODO_IMG_HEIGHT_V_X_RANGE[0] : ODO_IMG_HEIGHT_V_X_RANGE[1],
    ]
    sub_raw_img = cv2.resize(sub_raw_img, tuple(ODO_IMG_HEIGHT_V_RESIZE_RANGE))
    vert_deg_per_pixel = FOV_VERT_DEGREE / sub_raw_img.shape[0]

    if min_offset_yaw_rot > 0:
        sub_raw_img = sub_raw_img[
            :, min_offset_yaw_rot:
        ]  # Shift horizontally if offset > 0
    else:
        sub_raw_img = sub_raw_img[:, : sub_raw_img.shape[1] + min_offset_yaw_rot]

    SUB_HEIGHT_V_IMG = sub_raw_img

    image_y_sums = np.sum(sub_raw_img, axis=1)
    avg_intensity = np.sum(image_y_sums) / image_y_sums.size
    image_y_sums = image_y_sums / avg_intensity

    # Compare the height image with previous image to get offset and intensity difference
    min_offset_height_v, min_diff_intensity_height = compare_segments(
        image_y_sums, PREV_HEIGHT_V_IMG_Y_SUMS, ODO_SHIFT_MATCH_VERT, image_y_sums.size
    )

    if min_offset_height_v < 0:
        min_diff_intensity_height = -min_diff_intensity_height

    OFFSET_HEIGHT_V = min_offset_height_v

    # Convert perceptual speed into physical speed
    if min_offset_height_v > 3:
        height_v = ODO_HEIGHT_V_SCALE * min_diff_intensity_height
    else:
        height_v = 0

    # Ensure height velocity doesn't exceed max threshold
    if abs(height_v) > MAX_HEIGHT_V_THRESHOLD:
        height_v = PREV_HEIGHT_V
    else:
        PREV_HEIGHT_V = height_v

    PREV_HEIGHT_V_IMG_Y_SUMS = image_y_sums

    return trans_v, yaw_rot_v, height_v


# Key Changes and Explanations:

#     Global Variables:
#         The same global variables are used in Python with global keyword to ensure they are accessible and mutable within the function scope.

#     Image Resizing:
#         MATLAB's imresize is replaced by cv2.resize in Python, which resizes the images to the specified dimensions (as defined in the global variables).

#     Summing Intensities:
#         Instead of using MATLAB's sum() function, the code uses np.sum() for summing the intensity values across rows or columns.

#     Comparison:
#         The compare_segments function is assumed to be defined elsewhere and remains unchanged in Python. It is used to compute the image offset and intensity difference, which are crucial for velocity calculations.

#     Velocity Calculations:
#         The translational and rotational velocities are calculated similarly to the MATLAB code, with conditions checking whether the computed velocities exceed the respective thresholds.

#     Height Velocity:
#         The height velocity is computed based on the difference in intensity between consecutive vertical image profiles. If the offset is large enough, a valid height change velocity is calculated; otherwise, it defaults to zero.

#     Thresholding:
#         Velocity values are capped using the defined MAX_*_V_THRESHOLD values, and the previous velocity is maintained if a calculated velocity exceeds the threshold.

# Assumptions:

#     compare_segments Function: This function is assumed to handle the comparison between the current and previous image scanlines, returning the offset and intensity difference. This will need to be defined separately
