import { Response } from "express"

export interface ApiOptions {
    success: boolean,
    message: string,
    data?: any,
    error?: any,
    statusCode: number
}

export function ApiResponse(res: Response, options: ApiOptions) {
    const {
        success,
        message,
        data = null,
        error = null,
        statusCode = 200
    } = options

    return res.status(statusCode).json({
        success,
        message,
        ...(data !== null ? {data} : {}),
        ...(error !== null ? {error} : {})
    })
}
