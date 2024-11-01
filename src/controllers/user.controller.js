import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndTokenRefresh  = async(userId) => {
   try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       user.save({validateBeforeSave: false})
   } catch (error) {
      throw new ApiError(500, "something went wrong while generating refresh token")
   }
}

const userRegister = asyncHandler(async (req, res) => {
   const {fullName, email, username, password } = req.body

   if(
      [fullName, email, username, password].some((field) => 
         field.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }
   const existanceUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if(existanceUser){
      throw new ApiError(409, "User with email or username already exists")
   }
     const avatarLocalPath = req.files?.avatar[0]?.path; 
   

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }

     if (!avatarLocalPath) {
      throw new ApiError("avatar file is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatarLocalPath) {
      throw new ApiError("avatar file is required")
   }
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email, 
      password,
      username: username.toLowerCase()
   })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
      throw new ApiError(500, "server went wrong")
    }
    return res.status(200).json(
      new ApiResponse(200, createdUser, "user registered successfully")
    )

})

const loginUser = asyncHandler(async(req, res) => {
    const {email, password, username} = await req.body;
    if (!username && !email) {
      throw new ApiError(400, "email or password is required");
    }
   const user = await User.findOne({
      $or: [{username, email}]
   })
   if (!user) {
      throw new ApiError(404, "user not found")
   }
  const isPasswordValid = user.isPasswordCorrect(password)
   if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect Password")
   }
     const {accessToken, refreshToken} = await generateAccessAndTokenRefresh(user._id)
     const loggedInUser = await User.findById(user._id).select("-password, refreshToeken")
     
     const options = {
      httpOnly: true,
      secure: true
     }

     return res.status(500)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )
})

const logoutUser = asyncHandler(async(req, res) => {
   await User.findByIdAndUpdate(
       req.user._id,
       {
           $unset: {
               refreshToken: 1 // this removes the field from document
           }
       },
       {
           new: true
       }
   )

   const options = {
       httpOnly: true,
       secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})


export {userRegister, loginUser, logoutUser}