export function yawHeightHdcIteration(vt_id, yawRotV, heightV, g) {
    // Pose cell update steps
    // 1. Add view template energy
    // 2. Local excitation
    // 3. Local inhibition
    // 4. Global inhibition
    // 5. Normalisation
    // 6. Path Integration (yawRotV then heightV)

    // "global" inputs
        // g.YAW_HEIGHT_HDC; // The HD cells of yaw and height conjunctively
        // g.YAW_HEIGHT_HDC_Y_DIM; // The dimension of yaw in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_H_DIM; // The dimension of height in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_EXCIT_Y_DIM; // The dimension of local excitation weight matrix for yaw
        // g.YAW_HEIGHT_HDC_EXCIT_H_DIM; // The dimension of local excitation weight matrix for height
        // g.YAW_HEIGHT_HDC_INHIB_Y_DIM; // The dimension of local inhibition weight matrix for yaw
        // g.YAW_HEIGHT_HDC_INHIB_H_DIM; // The dimension of local inhibition weight matrix for height
        // g.YAW_HEIGHT_HDC_GLOBAL_INHIB; // The g.inhibition value
        // g.YAW_HEIGHT_HDC_VT_INJECT_ENERGY;  // The amount of energy injected when a view template is re-seen
        // g.YAW_HEIGHT_HDC_EXCIT_Y_WRAP; // The excit wrap of yaw in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_EXCIT_H_WRAP; // The excit wrap of height in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_INHIB_Y_WRAP; // The inhibit wrap of yaw in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_INHIB_H_WRAP; // The inhibit wrap of height in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_EXCIT_WEIGHT; // The weight of excitation in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_INHIB_WEIGHT; // The weight of inhibition in yaw_height_hdc network
        // g.YAW_HEIGHT_HDC_Y_TH_SIZE;   // The yaw theta size of each unit in radian, 2*pi/ g.YAW_HEIGHT_HDC_Y_DIM
        // g.YAW_HEIGHT_HDC_H_SIZE;      // radian e.g. 2*pi/360 = 0.0175
        // g.VT; // The visual templete
    // mutated global:
        // g.YAW_HEIGHT_HDC; // The HD cells of yaw and height conjunctively
    let newYawHeightHdc = structuredClone(g.YAW_HEIGHT_HDC)

    // if this isn't a new visual template then add the energy at its associated posecell location
    if (g.VT(vt_id).first != 1) {
        let actYaw = min([max([round(g.VT(vt_id).hdc_yaw), 1]), g.YAW_HEIGHT_HDC_Y_DIM]);
        let actHeight = min([max([round(g.VT(vt_id).hdc_height), 1]), g.YAW_HEIGHT_HDC_H_DIM]);

        // this decays the amount of energy that is injected at the visual template's posecell location
        // this is important as the posecell Posecells will errounously snap 
        // for bad visual template matches that occur over long periods (eg a bad matches that
        // occur while the agent is stationary). This means that multiple visual template's
        // need to be recognised for a snap to happen
        energy = g.YAW_HEIGHT_HDC_VT_INJECT_ENERGY * 1/30 * (30 - exp(1.2 * g.VT(vt_id).decay));
        if (energy > 0) {
            newYawHeightHdc[actYaw][actHeight] = newYawHeightHdc[actYaw][actHeight] + energy;
        }
    }


    // Local excitation: yaw_height_hdc_local_excitation = yaw_height_hdc elements * yaw_height_hdc weights
    yawHeightHdcLocalExcitNew = zeros(g.YAW_HEIGHT_HDC_Y_DIM, g.YAW_HEIGHT_HDC_H_DIM);
    for (h = 1 : g.YAW_HEIGHT_HDC_H_DIM) {
        for (y = 1 : g.YAW_HEIGHT_HDC_Y_DIM) {
            if (newYawHeightHdc[y][h] != 0) {
                yawHeightHdcLocalExcitNew[
                    g.YAW_HEIGHT_HDC_EXCIT_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_EXCIT_Y_DIM - 1],
                    g.YAW_HEIGHT_HDC_EXCIT_H_WRAP[h : h + g.YAW_HEIGHT_HDC_EXCIT_H_DIM - 1]
                ] = (
                    yawHeightHdcLocalExcitNew[
                        g.YAW_HEIGHT_HDC_EXCIT_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_EXCIT_Y_DIM - 1],
                        g.YAW_HEIGHT_HDC_EXCIT_H_WRAP[h : h + g.YAW_HEIGHT_HDC_EXCIT_H_DIM - 1]
                    ] + (
                        newYawHeightHdc[y,h] .* g.YAW_HEIGHT_HDC_EXCIT_WEIGHT
                    )
                )
            }    
        }
    }
    newYawHeightHdc = yawHeightHdcLocalExcitNew;

    // local inhibition: yaw_height_hdc_local_inhibition = hdc - hdc elements * hdc_inhib weights
    yawHeightHdcLocalInhibNew = zeros(g.YAW_HEIGHT_HDC_Y_DIM, g.YAW_HEIGHT_HDC_H_DIM);  
    for (h = 1 : g.YAW_HEIGHT_HDC_H_DIM) {
        for (y = 1 : g.YAW_HEIGHT_HDC_Y_DIM) {
            if (newYawHeightHdc[y, h] != 0) {
                yawHeightHdcLocalInhibNew[g.YAW_HEIGHT_HDC_INHIB_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_INHIB_Y_DIM - 1],g.YAW_HEIGHT_HDC_INHIB_H_WRAP[h : h + g.YAW_HEIGHT_HDC_INHIB_H_DIM - 1]] = 
                    yawHeightHdcLocalInhibNew[g.YAW_HEIGHT_HDC_INHIB_Y_WRAP[y : y + g.YAW_HEIGHT_HDC_INHIB_Y_DIM - 1],g.YAW_HEIGHT_HDC_INHIB_H_WRAP[h : h + g.YAW_HEIGHT_HDC_INHIB_H_DIM - 1]]  + newYawHeightHdc[y, h] .* g.YAW_HEIGHT_HDC_INHIB_WEIGHT;
            }
        }
    }
    newYawHeightHdc = newYawHeightHdc - yawHeightHdcLocalInhibNew;

    // g.inhibition - PC_gi = PC_li elements - inhibition
    newYawHeightHdc = (newYawHeightHdc >= g.YAW_HEIGHT_HDC_GLOBAL_INHIB) .* (newYawHeightHdc - g.YAW_HEIGHT_HDC_GLOBAL_INHIB);
    
    // normalisation
    total = sum(sum(newYawHeightHdc));
    newYawHeightHdc = newYawHeightHdc./total;       
    
    if (yawRotV != 0) {
        // mod to work out the partial shift amount
        weight = mod(abs(yawRotV) / g.YAW_HEIGHT_HDC_Y_TH_SIZE, 1);
        if (weight == 0) {
            weight = 1.0;
        }
        newYawHeightHdc = circshift(
                newYawHeightHdc, 
                [sign(yawRotV) * floor(mod(abs(yawRotV) / g.YAW_HEIGHT_HDC_Y_TH_SIZE, g.YAW_HEIGHT_HDC_Y_DIM)) 0]
            ) * (1.0 - weight) + circshift(
                newYawHeightHdc,
                [sign(yawRotV) * ceil(mod(abs(yawRotV) / g.YAW_HEIGHT_HDC_Y_TH_SIZE, g.YAW_HEIGHT_HDC_Y_DIM)) 0]
            ) * (weight);
    }
    
    if (heightV != 0) {
        // mod to work out the partial shift amount
        weight = mod(abs(heightV) / g.YAW_HEIGHT_HDC_H_SIZE, 1);
        if (weight == 0) {
            weight = 1.0;
        }
        newYawHeightHdc = circshift(
                newYawHeightHdc,
                [0 sign(heightV) * floor(mod(abs(heightV) / g.YAW_HEIGHT_HDC_H_SIZE, g.YAW_HEIGHT_HDC_H_DIM]
            ) * (1.0 - weight) + circshift(
                newYawHeightHdc, 
                [0 sign(heightV) * ceil(mod(abs(heightV) / g.YAW_HEIGHT_HDC_H_SIZE, g.YAW_HEIGHT_HDC_H_DIM]
            ) * (weight);
    }
    
    return newYawHeightHdc
}






