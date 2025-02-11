export function expInitial({EXP_LOOPS, EXP_CORRECTION, DELTA_EXP_GC_HDC_THRESHOLD, gc_inital_position}) {
    // The number of times to run the experience map correction per frame
    // EXP_LOOPS;

    // The amount to correct each experience on either side of a link ( >0.5 is unstable)
    // EXP_CORRECTION; 

    // The experience delta threshold 
    // The threshold change in pose cell activity to generate a new exp given the same view template
    // DELTA_EXP_GC_HDC_THRESHOLD;

    // All experiences (global object, not an array)
    const EXPERIENCES = [];

    // Integrate the delta x, y, z, yaw
    // Rad radian accumulative
    let ACCUM_DELTA_X = 0;
    let ACCUM_DELTA_Y = 0;
    let ACCUM_DELTA_Z = 0;
    let ACCUM_DELTA_YAW = 0;

    // The number of total experiences
    let NUM_EXPS = 0;

    // The current experience ID
    let CUR_EXP_ID = 0;

    // Experience history (used as a flag here)
    let EXP_HISTORY = 1;

    let MIN_DELTA_EM = [0]; // Initialized with first value

    // HDC (set the initial position in the hdcell network)
    let curYawTheta = 1;  // in 1:36
    let curHeightValue = 1;  // in 1:36

    // GC (set the initial position in the grid cell network)
    const [gcX, gcY, gcZ] = gc_inital_position;

    // Initialize the experience
    EXP_HISTORY = 1;
    NUM_EXPS = 1;
    CUR_EXP_ID = 1;

    // Initialize the experience object
    let currentExperience = {
        x_gc: gcX,
        y_gc: gcY,
        z_gc: gcZ,
        yaw_hdc: curYawTheta,
        height_hdc: curHeightValue,
        vt_id: 1,
        x_exp: 0,
        y_exp: 0,
        z_exp: 0,
        yaw_exp_rad: 0,
        numlinks: 0,
        links: []
    };

    // Save experience into global list of experiences
    EXPERIENCES[CUR_EXP_ID - 1] = currentExperience; // Index adjusted for JS (starts at 0)

    return {
        EXPERIENCES,
        ACCUM_DELTA_X,
        ACCUM_DELTA_Y,
        ACCUM_DELTA_Z,
        ACCUM_DELTA_YAW,
        NUM_EXPS,
        CUR_EXP_ID,
        EXP_HISTORY,
        MIN_DELTA_EM,
        // passed through
        EXP_LOOPS,
        EXP_CORRECTION,
        DELTA_EXP_GC_HDC_THRESHOLD,
    }
}
