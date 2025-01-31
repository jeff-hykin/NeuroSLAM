import numpy as np


def gc_iteration(vt_id, transV, curYawThetaInRadian, heightV):
    """
    Performs a 3D Grid Cell update step in NeuroSLAM.

    Parameters:
        vt_id (int): The ID of the visual template.
        transV (float): The translation velocity.
        curYawThetaInRadian (float): The current yaw angle in radians.
        heightV (float): The vertical velocity.
    """
    global GRIDCELLS
    global VT
    global GC_X_DIM, GC_Y_DIM, GC_Z_DIM
    global GC_EXCIT_X_DIM, GC_EXCIT_Y_DIM, GC_EXCIT_Z_DIM
    global GC_INHIB_X_DIM, GC_INHIB_Y_DIM, GC_INHIB_Z_DIM
    global GC_GLOBAL_INHIB
    global GC_VT_INJECT_ENERGY
    global GC_EXCIT_X_WRAP, GC_EXCIT_Y_WRAP, GC_EXCIT_Z_WRAP
    global GC_INHIB_X_WRAP, GC_INHIB_Y_WRAP, GC_INHIB_Z_WRAP
    global GC_EXCIT_WEIGHT
    global GC_INHIB_WEIGHT
    global GC_X_TH_SIZE, GC_Y_TH_SIZE, GC_Z_TH_SIZE

    # Step 1: Visual Template Energy Injection
    if VT[vt_id].first != 1:
        actX = min(max(round(VT[vt_id].gc_x), 1), GC_X_DIM)
        actY = min(max(round(VT[vt_id].gc_y), 1), GC_Y_DIM)
        actZ = min(max(round(VT[vt_id].gc_z), 1), GC_Z_DIM)

        energy = GC_VT_INJECT_ENERGY * (1 / 30) * (30 - np.exp(1.2 * VT[vt_id].decay))
        if energy > 0:
            GRIDCELLS[
                actX - 1, actY - 1, actZ - 1
            ] += energy  # Adjust for 0-based indexing

    # Step 2: Local Excitation
    gridcell_local_excit_new = np.zeros((GC_X_DIM, GC_Y_DIM, GC_Z_DIM))
    for z in range(GC_Z_DIM):
        for x in range(GC_X_DIM):
            for y in range(GC_Y_DIM):
                if GRIDCELLS[x, y, z] != 0:
                    gridcell_local_excit_new[
                        GC_EXCIT_X_WRAP[x : x + GC_EXCIT_X_DIM],
                        GC_EXCIT_Y_WRAP[y : y + GC_EXCIT_Y_DIM],
                        GC_EXCIT_Z_WRAP[z : z + GC_EXCIT_Z_DIM],
                    ] += (
                        GRIDCELLS[x, y, z] * GC_EXCIT_WEIGHT
                    )

    GRIDCELLS = gridcell_local_excit_new

    # Step 3: Local Inhibition
    gridcell_local_inhib_new = np.zeros((GC_X_DIM, GC_Y_DIM, GC_Z_DIM))
    for z in range(GC_Z_DIM):
        for x in range(GC_X_DIM):
            for y in range(GC_Y_DIM):
                if GRIDCELLS[x, y, z] != 0:
                    gridcell_local_inhib_new[
                        GC_INHIB_X_WRAP[x : x + GC_INHIB_X_DIM],
                        GC_INHIB_Y_WRAP[y : y + GC_INHIB_Y_DIM],
                        GC_INHIB_Z_WRAP[z : z + GC_INHIB_Z_DIM],
                    ] += (
                        GRIDCELLS[x, y, z] * GC_INHIB_WEIGHT
                    )

    GRIDCELLS -= gridcell_local_inhib_new

    # Step 4: Global Inhibition
    GRIDCELLS = (GRIDCELLS >= GC_GLOBAL_INHIB) * (GRIDCELLS - GC_GLOBAL_INHIB)

    # Step 5: Normalization
    total = np.sum(GRIDCELLS)
    GRIDCELLS /= total

    # Step 6: Path Integration (Translation in x-y plane)
    for indZ in range(GC_Z_DIM):
        if curYawThetaInRadian == 0:
            GRIDCELLS[:, :, indZ] = (
                GRIDCELLS[:, :, indZ] * (1.0 - transV)
                + np.roll(GRIDCELLS[:, :, indZ], shift=1, axis=1) * transV
            )
        elif curYawThetaInRadian == np.pi / 2:
            GRIDCELLS[:, :, indZ] = (
                GRIDCELLS[:, :, indZ] * (1.0 - transV)
                + np.roll(GRIDCELLS[:, :, indZ], shift=1, axis=0) * transV
            )
        elif curYawThetaInRadian == np.pi:
            GRIDCELLS[:, :, indZ] = (
                GRIDCELLS[:, :, indZ] * (1.0 - transV)
                + np.roll(GRIDCELLS[:, :, indZ], shift=-1, axis=1) * transV
            )
        elif curYawThetaInRadian == 3 * np.pi / 2:
            GRIDCELLS[:, :, indZ] = (
                GRIDCELLS[:, :, indZ] * (1.0 - transV)
                + np.roll(GRIDCELLS[:, :, indZ], shift=-1, axis=0) * transV
            )
        else:
            gcInZPlane90 = np.rot90(
                GRIDCELLS[:, :, indZ], k=int(np.floor(curYawThetaInRadian * 2 / np.pi))
            )

            dir90 = (
                curYawThetaInRadian
                - np.floor(curYawThetaInRadian * 2 / np.pi) * np.pi / 2
            )

            gcInZPlaneNew = np.zeros((GC_X_DIM + 2, GC_Y_DIM + 2))
            gcInZPlaneNew[1:-1, 1:-1] = gcInZPlane90

            weight_sw = transV**2 * np.cos(dir90) * np.sin(dir90)
            weight_se = transV * np.sin(dir90) - transV**2 * np.cos(dir90) * np.sin(
                dir90
            )
            weight_nw = transV * np.cos(dir90) - transV**2 * np.cos(dir90) * np.sin(
                dir90
            )
            weight_ne = 1.0 - weight_sw - weight_se - weight_nw

            gcInZPlaneNew = (
                gcInZPlaneNew * weight_ne
                + np.roll(gcInZPlaneNew, shift=1, axis=1) * weight_nw
                + np.roll(gcInZPlaneNew, shift=1, axis=0) * weight_se
                + np.roll(gcInZPlaneNew, shift=(1, 1), axis=(0, 1)) * weight_sw
            )

            gcInZPlane90 = gcInZPlaneNew[1:-1, 1:-1]
            gcInZPlane90[1:, 0] += gcInZPlaneNew[2:-1, -1]
            gcInZPlane90[0, 1:] += gcInZPlaneNew[-1, 2:-1]
            gcInZPlane90[0, 0] += gcInZPlaneNew[-1, -1]

            GRIDCELLS[:, :, indZ] = np.rot90(
                gcInZPlane90, k=4 - int(np.floor(curYawThetaInRadian * 2 / np.pi))
            )

    # Step 7: Path Integration in Z-axis
    if heightV != 0:
        weight = np.mod(np.abs(heightV) / GC_Z_TH_SIZE, 1)
        if weight == 0:
            weight = 1.0
        GRIDCELLS = (
            np.roll(
                GRIDCELLS,
                shift=[
                    0,
                    0,
                    int(
                        np.sign(heightV)
                        * np.floor(np.mod(np.abs(heightV) / GC_Z_TH_SIZE, GC_Z_DIM))
                    ),
                ],
                axis=2,
            )
            * (1.0 - weight)
            + np.roll(
                GRIDCELLS,
                shift=[
                    0,
                    0,
                    int(
                        np.sign(heightV)
                        * np.ceil(np.mod(np.abs(heightV) / GC_Z_TH_SIZE, GC_Z_DIM))
                    ),
                ],
                axis=2,
            )
            * weight
        )


# Explanation of Changes:

#     Global Variables: In Python, global variables are explicitly referenced, similar to how they are used in MATLAB. The code assumes that all global variables (GRIDCELLS, VT, etc.) are already initialized elsewhere in the code.
#     Indexing: Python uses 0-based indexing, so whenever MATLAB code uses 1-based indexing (like actX = min([max([round(VT(vt_id).gc_x), 1]), GC_X_DIM])), the index is adjusted for 0-based indexing in Python.
#     Mathematical Functions: I used np.exp, np.pi, np.roll, and other numpy operations to replace MATLAB-specific functions.
#     Rotation and Shifting: I used np.rot90() and np.roll() to handle the circular shifts and rotations in the grid cell network.
#     Normalization: Summing over the 3D grid and dividing by the total ensures the grid is normalized, similar to the MATLAB version.

# Example Usage:

# # Example: assuming that all necessary global variables and classes like VT are set up
# gc_iteration(vt_id=0, transV=0.1, curYawThetaInRadian=np.pi/2, heightV=0.5)
