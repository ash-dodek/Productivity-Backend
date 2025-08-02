import { ApiResponse } from '../utils/ApiResponse';
import { Response, Request } from 'express';
import { UserModel } from '../models/user.model';
export const registerUser = async (req: Request, res: Response) => {
    try {
        const {name, userName, email, password} = req.body

        if(!name || !email || !password || !userName){
            return ApiResponse(res, {
                success: false, 
                message: "All fields are required",
                statusCode: 400
            })
        }

        const user = await UserModel.create({name, email, password, userName})
        console.log(user)
        return ApiResponse(
            res, 
            {
                success: true,
                message: "User Created",
                statusCode: 200,
                data: user
            }
        )
    } catch (error) {
        console.log(error)
        return ApiResponse(
            res, 
            {
                success: false,
                message: "Internal Server error",
                statusCode: 500
            }
        )
    }
}