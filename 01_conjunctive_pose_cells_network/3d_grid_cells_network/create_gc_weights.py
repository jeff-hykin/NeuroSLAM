import numpy as np


def create_gc_weights(xDim, yDim, zDim, xVar, yVar, zVar):
    """
    Creates a 3D normalized distribution of size (xDim, yDim, zDim) with variances xVar, yVar, zVar.

    Parameters:
        xDim (int): Dimension of x-axis.
        yDim (int): Dimension of y-axis.
        zDim (int): Dimension of z-axis.
        xVar (float): Variance in the x-axis.
        yVar (float): Variance in the y-axis.
        zVar (float): Variance in the z-axis.

    Returns:
        np.ndarray: Normalized weight matrix.
    """
    # Calculate the center points of the dimensions
    xDimCentre = xDim // 2
    yDimCentre = yDim // 2
    zDimCentre = zDim // 2

    # Initialize the weight matrix
    weight = np.zeros((xDim, yDim, zDim))

    # Compute the 3D Gaussian weights
    for z in range(zDim):
        for x in range(xDim):
            for y in range(yDim):
                weight[x, y, z] = (
                    (
                        1
                        / (xVar * np.sqrt(2 * np.pi))
                        * np.exp(-((x - xDimCentre) ** 2) / (2 * xVar**2))
                    )
                    * (
                        1
                        / (yVar * np.sqrt(2 * np.pi))
                        * np.exp(-((y - yDimCentre) ** 2) / (2 * yVar**2))
                    )
                    * (
                        1
                        / (zVar * np.sqrt(2 * np.pi))
                        * np.exp(-((z - zDimCentre) ** 2) / (2 * zVar**2))
                    )
                )

    # Normalize the weight matrix
    total = np.sum(weight)
    weight /= total

    return weight
