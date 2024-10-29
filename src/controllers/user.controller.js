import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const userRegister = asyncHandler(async (req, res) => {
   const {email, password} = req.body;
   console.log("email", email);

   if(
      [fullName, email, username, password].some((field) => 
         field.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }
   const existanceUser = User.findOne({
      $or: [{ username }, { email }]
   })

   if(existanceUser){
      throw new ApiError(409, "User with email or username already exists")
   }
     const avatarLocalPath = req.files?.avatar[0]?.path; 
     const coverImageLocalPath = req.files?.coverImage[0]?.path;

     if (!avatarLocalPath) {
      throw new ApiError("avatar file is required")
   }

   const avatarPath = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
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

export {userRegister}