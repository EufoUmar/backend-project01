import { asyncHandler } from "../utils/asyncHandler.js";

const userRegister = asyncHandler(async (req, res) => {
   const {email, password} = req.body;
   console.log("email", email);
   
})

export {userRegister}