import { ApiResponse } from '../utils/ApiResponse'
import { Response, Request } from 'express'
import { UserModel } from '../models/user.model'
import bcrypt from 'bcrypt'


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
        const refreshToken = await user.generateRefreshToken()
        console.log(refreshToken)
        res.cookie('refreshToken', refreshToken!, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 365 * 24 * 60 * 60 * 1000
        })
        //refreshToken set in the browser(http only, which ould be accessed by backend only)

        return ApiResponse(
            res, 
            {
                success: true,
                message: "User Created",
                statusCode: 200,
                data: user
            })

    } catch (error: any) {
        if(error.code == 11000) {
            return ApiResponse(
            res, 
            {
                success: false,
                message: "User already exists",
                statusCode: 419
            })
        }

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

export const LoginUser = async (req : Request, res: Response) => {
    try {
        const {userName, email, password} = req.body
    
        if(!email || !password || !userName){
            return ApiResponse(res, {
                success: false, 
                message: "All fields are required",
                statusCode: 400
            })
        }
        const user = await UserModel.findOne({userName})
        if(!user) return ApiResponse(res, {
            success: false,
            message: "User doesnt exist",
            statusCode: 404
        })

        if(await bcrypt.compare(password, user.password)){
            //if correct password, then
            const refreshToken = await user.generateRefreshToken()
            res.cookie('refreshToken', refreshToken!, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 365 * 24 * 60 * 60 * 1000
            })

            return ApiResponse(res, 
                {success: true, message: "Logged In", data: user, statusCode: 200}
            )
        }
        else{
            return ApiResponse(res, {
                success: false, 
                message: "Invalid Credentials",
                statusCode: 400
            })
        }

    } catch (error) {
        return ApiResponse(
            res, 
            {
                success: false,
                message: "Internal Server Error",
                statusCode: 500,
            })
    }
}

export const LogoutUser = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
    return ApiResponse(res, {
        success: true,
        message: "Logged out",
        statusCode: 200
    })
}