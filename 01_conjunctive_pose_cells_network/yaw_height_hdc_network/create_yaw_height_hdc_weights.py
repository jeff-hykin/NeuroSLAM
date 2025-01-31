import numpy as np


def create_yaw_height_hdc_weights(yawDim, heightDim, yawVar, heightVar):
    """
    Creates a 2D normalized distribution of size (yawDim x heightDim) with
    variances yawVar and heightVar.

    Parameters:
        yawDim (int): The dimension for the yaw axis.
        heightDim (int): The dimension for the height axis.
        yawVar (float): The variance for the yaw axis.
        heightVar (float): The variance for the height axis.

    Returns:
        numpy.ndarray: The normalized 2D weight distribution.
    """
    yawDimCentre = (yawDim // 2) + 1
    heightDimCentre = (heightDim // 2) + 1

    # Create an empty 2D weight matrix
    weight = np.zeros((yawDim, heightDim))

    # Calculate the 2D Gaussian distribution
    for h in range(heightDim):
        for y in range(yawDim):
            weight[y, h] = (
                (1 / (yawVar * np.sqrt(2 * np.pi)))
                * np.exp(-((y - yawDimCentre) ** 2) / (2 * yawVar**2))
                * (1 / (heightVar * np.sqrt(2 * np.pi)))
                * np.exp(-((h - heightDimCentre) ** 2) / (2 * heightVar**2))
            )

    # Normalize the weights to ensure the sum equals 1
    total = np.sum(weight)
    weight /= total

    return weight


# Explanation:

#     yawDimCentre and heightDimCentre: These are computed to find the center of the yaw and height dimensions, similar to the MATLAB floor operation.
#     Weight Matrix Calculation: The 2D weight matrix is created using nested loops, where each element is calculated based on a 2D Gaussian distribution using yawVar and heightVar.
#     Normalization: The total sum of the weight matrix is computed using np.sum(), and then each element is divided by the total to normalize the matrix.
#     Return Value: The function returns the normalized 2D weight matrix.

# Example Usage:

# yawDim = 10
# heightDim = 10
# yawVar = 1.0
# heightVar = 1.0

# weights = create_yaw_height_hdc_weights(yawDim, heightDim, yawVar, heightVar)
# print(weights)

# This Python function should behave similarly to the MATLAB version and will generate a 2D normalized Gaussian distribution based on the specified dimensions and variances.
