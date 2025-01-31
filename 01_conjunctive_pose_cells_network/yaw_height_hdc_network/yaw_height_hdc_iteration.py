import numpy as np


def yaw_height_hdc_iteration(vt_id, yawRotV, heightV, VT, YAW_HEIGHT_HDC, params):
    """
    Perform the yaw and height posecell update based on input parameters.

    Parameters:
        vt_id (int): ID of the visual template.
        yawRotV (float): Yaw rotation velocity.
        heightV (float): Height velocity.
        VT (list): List of visual template structures with 'hdc_yaw', 'hdc_height', and 'decay'.
        YAW_HEIGHT_HDC (numpy.ndarray): The current yaw-height posecell grid.
        params (dict): A dictionary containing the necessary parameters (e.g. dimensions, weights, etc.).

    Returns:
        numpy.ndarray: The updated yaw-height posecell grid.
    """
    # Extract parameters
    YAW_HEIGHT_HDC_Y_DIM = params["YAW_HEIGHT_HDC_Y_DIM"]
    YAW_HEIGHT_HDC_H_DIM = params["YAW_HEIGHT_HDC_H_DIM"]
    YAW_HEIGHT_HDC_EXCIT_Y_DIM = params["YAW_HEIGHT_HDC_EXCIT_Y_DIM"]
    YAW_HEIGHT_HDC_EXCIT_H_DIM = params["YAW_HEIGHT_HDC_EXCIT_H_DIM"]
    YAW_HEIGHT_HDC_INHIB_Y_DIM = params["YAW_HEIGHT_HDC_INHIB_Y_DIM"]
    YAW_HEIGHT_HDC_INHIB_H_DIM = params["YAW_HEIGHT_HDC_INHIB_H_DIM"]
    YAW_HEIGHT_HDC_GLOBAL_INHIB = params["YAW_HEIGHT_HDC_GLOBAL_INHIB"]
    YAW_HEIGHT_HDC_VT_INJECT_ENERGY = params["YAW_HEIGHT_HDC_VT_INJECT_ENERGY"]
    YAW_HEIGHT_HDC_EXCIT_Y_WRAP = params["YAW_HEIGHT_HDC_EXCIT_Y_WRAP"]
    YAW_HEIGHT_HDC_EXCIT_H_WRAP = params["YAW_HEIGHT_HDC_EXCIT_H_WRAP"]
    YAW_HEIGHT_HDC_INHIB_Y_WRAP = params["YAW_HEIGHT_HDC_INHIB_Y_WRAP"]
    YAW_HEIGHT_HDC_INHIB_H_WRAP = params["YAW_HEIGHT_HDC_INHIB_H_WRAP"]
    YAW_HEIGHT_HDC_EXCIT_WEIGHT = params["YAW_HEIGHT_HDC_EXCIT_WEIGHT"]
    YAW_HEIGHT_HDC_INHIB_WEIGHT = params["YAW_HEIGHT_HDC_INHIB_WEIGHT"]
    YAW_HEIGHT_HDC_Y_TH_SIZE = params["YAW_HEIGHT_HDC_Y_TH_SIZE"]
    YAW_HEIGHT_HDC_H_SIZE = params["YAW_HEIGHT_HDC_H_SIZE"]

    # 1. Add view template energy
    if VT[vt_id]["first"] != 1:
        act_yaw = min(max(round(VT[vt_id]["hdc_yaw"]), 1), YAW_HEIGHT_HDC_Y_DIM)
        act_height = min(max(round(VT[vt_id]["hdc_height"]), 1), YAW_HEIGHT_HDC_H_DIM)

        energy = (
            YAW_HEIGHT_HDC_VT_INJECT_ENERGY
            * 1
            / 30
            * (30 - np.exp(1.2 * VT[vt_id]["decay"]))
        )
        if energy > 0:
            YAW_HEIGHT_HDC[act_yaw, act_height] += energy

    # 2. Local excitation
    yaw_height_hdc_local_excit_new = np.zeros(
        (YAW_HEIGHT_HDC_Y_DIM, YAW_HEIGHT_HDC_H_DIM)
    )
    for h in range(YAW_HEIGHT_HDC_H_DIM):
        for y in range(YAW_HEIGHT_HDC_Y_DIM):
            if YAW_HEIGHT_HDC[y, h] != 0:
                yaw_height_hdc_local_excit_new[
                    YAW_HEIGHT_HDC_EXCIT_Y_WRAP[y : y + YAW_HEIGHT_HDC_EXCIT_Y_DIM],
                    YAW_HEIGHT_HDC_EXCIT_H_WRAP[h : h + YAW_HEIGHT_HDC_EXCIT_H_DIM],
                ] += (
                    YAW_HEIGHT_HDC[y, h] * YAW_HEIGHT_HDC_EXCIT_WEIGHT
                )
    YAW_HEIGHT_HDC = yaw_height_hdc_local_excit_new

    # 3. Local inhibition
    yaw_height_hdc_local_inhib_new = np.zeros(
        (YAW_HEIGHT_HDC_Y_DIM, YAW_HEIGHT_HDC_H_DIM)
    )
    for h in range(YAW_HEIGHT_HDC_H_DIM):
        for y in range(YAW_HEIGHT_HDC_Y_DIM):
            if YAW_HEIGHT_HDC[y, h] != 0:
                yaw_height_hdc_local_inhib_new[
                    YAW_HEIGHT_HDC_INHIB_Y_WRAP[y : y + YAW_HEIGHT_HDC_INHIB_Y_DIM],
                    YAW_HEIGHT_HDC_INHIB_H_WRAP[h : h + YAW_HEIGHT_HDC_INHIB_H_DIM],
                ] += (
                    YAW_HEIGHT_HDC[y, h] * YAW_HEIGHT_HDC_INHIB_WEIGHT
                )
    YAW_HEIGHT_HDC -= yaw_height_hdc_local_inhib_new

    # 4. Global inhibition
    YAW_HEIGHT_HDC = np.where(
        YAW_HEIGHT_HDC >= YAW_HEIGHT_HDC_GLOBAL_INHIB,
        YAW_HEIGHT_HDC - YAW_HEIGHT_HDC_GLOBAL_INHIB,
        YAW_HEIGHT_HDC,
    )

    # 5. Normalization
    total = np.sum(YAW_HEIGHT_HDC)
    YAW_HEIGHT_HDC /= total

    # 6. Path Integration for Yaw Rotation (yawRotV)
    if yawRotV != 0:
        weight = np.mod(np.abs(yawRotV) / YAW_HEIGHT_HDC_Y_TH_SIZE, 1)
        if weight == 0:
            weight = 1.0
        YAW_HEIGHT_HDC = (
            np.roll(
                YAW_HEIGHT_HDC,
                shift=[
                    np.sign(yawRotV)
                    * int(
                        np.floor(
                            np.mod(np.abs(yawRotV), YAW_HEIGHT_HDC_Y_TH_SIZE)
                            / YAW_HEIGHT_HDC_Y_TH_SIZE
                        )
                    ),
                    0,
                ],
                axis=0,
            )
            * (1.0 - weight)
            + np.roll(
                YAW_HEIGHT_HDC,
                shift=[
                    np.sign(yawRotV)
                    * int(
                        np.ceil(
                            np.mod(np.abs(yawRotV), YAW_HEIGHT_HDC_Y_TH_SIZE)
                            / YAW_HEIGHT_HDC_Y_TH_SIZE
                        )
                    ),
                    0,
                ],
                axis=0,
            )
            * weight
        )

    # 7. Path Integration for Height (heightV)
    if heightV != 0:
        weight = np.mod(np.abs(heightV) / YAW_HEIGHT_HDC_H_SIZE, 1)
        if weight == 0:
            weight = 1.0
        YAW_HEIGHT_HDC = (
            np.roll(
                YAW_HEIGHT_HDC,
                shift=[
                    0,
                    np.sign(heightV)
                    * int(
                        np.floor(
                            np.mod(np.abs(heightV), YAW_HEIGHT_HDC_H_SIZE)
                            / YAW_HEIGHT_HDC_H_SIZE
                        )
                    ),
                ],
                axis=1,
            )
            * (1.0 - weight)
            + np.roll(
                YAW_HEIGHT_HDC,
                shift=[
                    0,
                    np.sign(heightV)
                    * int(
                        np.ceil(
                            np.mod(np.abs(heightV), YAW_HEIGHT_HDC_H_SIZE)
                            / YAW_HEIGHT_HDC_H_SIZE
                        )
                    ),
                ],
                axis=1,
            )
            * weight
        )

    return YAW_HEIGHT_HDC


# Explanation:

#     Parameters: The params dictionary is used to hold all the global constants that are referenced throughout the function. This is because Python doesn't have the global keyword like MATLAB. Passing these parameters via a dictionary helps manage them cleanly.

#     Energy Injection: The energy injection at the visual template’s posecell location is handled similarly to the MATLAB version. The energy is added only if the first field in the visual template is not 1, which means it’s not a new template.

#     Local Excitation: The yaw_height_hdc_local_excit_new matrix is created and filled based on local excitation rules. The loops go over the grid, and if the current position has a non-zero value, the excitation is applied using wrapping and weights.

#     Local Inhibition: The same logic is applied to the inhibition part, where inhibition is subtracted from the grid.

#     Global Inhibition: A simple thresholding operation is applied where values above a global inhibition threshold are reduced by that threshold.

#     Normalization: The matrix is normalized by dividing by its total sum.

#     Path Integration (Yaw and Height): The yaw and height velocities are used to perform circular shifts (via np.roll), with appropriate weights applied based on the movement (just as in MATLAB).

# Example Usage:
# To call this function in Python, you'd need to prepare the VT list (containing the visual template data) and a params dictionary with all the constants (like YAW_HEIGHT_HDC_Y_DIM, YAW_HEIGHT_HDC_H_SIZE, etc.). Here's an example of how you might set up those values:

# # Example of how to use the function
# params = {
#     'YAW_HEIGHT_HDC_Y_DIM': 360,
#     'YAW_HEIGHT_HDC_H_DIM': 100,
#     'YAW_HEIGHT_HDC_EXCIT_Y_DIM': 5,
#     'YAW_HEIGHT_HDC_EXCIT_H_DIM': 5,
#     'YAW_HEIGHT_HDC_INHIB_Y_DIM': 5,
#     'YAW_HEIGHT_HDC_INHIB_H_DIM': 5,
#     'YAW_HEIGHT_HDC_GLOBAL_INHIB': 0.1,
#     'YAW_HEIGHT_HDC_VT_INJECT_ENERGY': 0.5,
#     'YAW_HEIGHT_HDC_EXCIT_Y_WRAP': np.array([[0,1,2]]),  # Example wraps
#     'YAW_HEIGHT_HDC_EXCIT_H_WRAP': np.array([[0,1,2]]),  # Example wraps
#     'YAW_HEIGHT_HDC_INHIB_Y_WRAP': np.array([[0,1,2]]),  # Example wraps
#     'YAW_HEIGHT_HDC_INHIB_H_WRAP': np.array([[0,1,2]]),  # Example wraps
#     'YAW_HEIGHT_HDC_EXCIT_WEIGHT': 0.2,
#     'YAW_HEIGHT_HDC_INHIB_WEIGHT': 0.1,
#     'YAW_HEIGHT_HDC_Y_TH_SIZE': 0.0175,
#     'YAW_HEIGHT_HDC_H_SIZE': 0.1,
# }

# # Example visual template
# VT = [{'first': 0, 'hdc_yaw': 180, 'hdc_height': 50, 'decay': 2.0}]

# # Initialize the yaw-height posecell grid
# YAW_HEIGHT_HDC = np.zeros((params['YAW_HEIGHT_HDC_Y_DIM'], params['YAW_HEIGHT_HDC_H_DIM']))

# # Call the iteration function
# YAW_HEIGHT_HDC = yaw_height_hdc_iteration(0, 10, 5, VT, YAW_HEIGHT_HDC, params)

# print(YAW_HEIGHT_HDC)
