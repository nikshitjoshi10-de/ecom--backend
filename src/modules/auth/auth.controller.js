const RefreshModel = require("../../models/refresh.model");
const apiError = require("../../utils/apiError");
const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, NOT_FOUND } = require("../../utils/httpStatus");
const { refreshCookieOptions, accessCookieOptions, signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../utils/token");
const AuthService = require("./auth.service")

const generateToken = (res, user) => {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

// register Api Controller
const registerController = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userData = await AuthService.registerService({ name, email, password, role });

    const tokens = generateToken(res, userData.user);

    const refreshTokendata = await AuthService.createRefreshService({ userId: userData.user._id, token: tokens.refreshToken });

    res.status(201).json(apiResponse(201, { data: userData }, "User Created Succesfully"));
})

// Login Api Controller
const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
   
    const result = await AuthService.loginService({ email, password });

    const tokens = generateToken(res, result.user);
    
    const refreshTokendata = await AuthService.createRefreshService({ userId: result.user._id, token: tokens.refreshToken });
    
    res.status(200).json(apiResponse(200, { userData: result.user, refreshTokendata }, 'login successfully'))

});




// logout Api Controller

const logoutController = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);

    await AuthService.logoutService({ userID: req.user._id });

    res.status(OK).json(apiResponse(OK, null, "User logout Successfully"))
})

// change-Password Api Controller
const changePasswordController = asyncHandler(async (req, res) => {
    // req.body capture krta hai 
    const { oldPassword, newPassword } = req.body;

    //   pass body to service 
    await AuthService.changePasswordService({ userId: req.user._id, newPassword: newPassword, oldPassword: oldPassword });

    //   send response to client
    res.status(OK).json(apiResponse(OK, null, "Password change Successfully"))

})





// refresh Api Controller
// asyncHandler -->  try/catach rapper
// get refreshtoken from cookie
// delete old cookie 
// set new access token cookie
// 


const refreshController = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw apiError(NOT_FOUND, "refresh Token not found")
    };

    const decode = verifyRefreshToken(refreshToken)
 console.log("line 98 refresh controller", decode);

  const user= await AuthService.getUserDataById({_id:decode.sub});
    const newAccessToken = signAccessToken(user);
          
    res.cookie("accessToken", newAccessToken, accessCookieOptions)
    res.status(OK).json(apiResponse(OK, null, "Access token created and set to cookies successfully"))
})


module.exports = {
    registerController,
    loginController,
    logoutController,
    changePasswordController,
    refreshController
}