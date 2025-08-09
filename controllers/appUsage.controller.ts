import { Request, Response } from 'express'
import { ApiResponse } from '../utils/ApiResponse'
import { AppUsageModel } from '../models/appUsage.model';

export const addUsageOfApp = async (req: Request, res: Response) => {
    try {
        const {userId, date, appName, totalActiveTime, sessions} = req.body
        if(!date || !appName || !sessions || !totalActiveTime){
            return ApiResponse(res, {
                success: false, 
                message: "All fields are required",
                statusCode: 400
            })
        }

        const hasUser = await AppUsageModel.findOne({userId, date})
        if(!hasUser){ //if document for the user doesnt exists for the day
            const stats = [
                {
                    name: appName,
                    duration: 0, // SET THIS LATER
                    sessions
                }                
            ]
            const appUsageDoc = await AppUsageModel.create({
                userId, date, totalActiveTime, appStats: stats
            })
            
            return ApiResponse(res, {
                success: true,
                data: appUsageDoc,
                statusCode: 200,
                message: "Usage Updated"
            })
        }        
        const appsData = hasUser.appStats // appdata array
        // now find the app name exactly in the user

        for(const appObject of appsData){
            if(appObject.name === appName) {
                const appSessions = appObject.sessions
                for(const session of sessions){
                    appSessions.push(session)
                }
                const updatedData = await hasUser.save()
                return ApiResponse(res, {
                    success: true,
                    data: updatedData,
                    statusCode: 200,
                    message: "Usage Updated"
                })
            }
        }

        // If data of that app isnt created on that day.then create it
        appsData.push({
            name: appName,
            duration : 0,
            sessions,
            tag: "Untagged"
        })
        const updatedData = await hasUser.save()
        return ApiResponse(res, {
            success: true,
            data: updatedData,
            statusCode: 200,
            message: "Usage Updated"
        })

    } catch (error) {
        console.log(error)
        return ApiResponse(res, {
            success: false, 
            message: "Interval server error", 
            statusCode: 500, 
            data: error
        })
    }
}


export const getAppUsageByName = async (req: Request, res: Response) => {
    try {
        const appName = req.query?.appName
        const appId = req.query?.appId
        const { userId } = (req as any).user
        if(!appName && !appId){
            return ApiResponse(res, {
                success: false, 
                message: "Query not passed",
                statusCode: 400
            })
        }

        const userData = await AppUsageModel.findOne({userId})
        if(!userData) {
            return ApiResponse(res, {
                success: false,
                message: "No usage for the app",
                statusCode: 404
            })
        }
        const appsData = userData.appStats
        // UPDATE LOGIC, TO GET ALL INFO OF AN APP, for a given date or all
        for(const appData of appsData) {
            if((appData.name === appName) || ((appData as any)._id.toString() === appId)) {
                return ApiResponse(res, {
                    success: true,
                    message: "Usage provided",
                    data: appData,
                    statusCode: 200
                })
            }
            else{
                return ApiResponse(res, {
                    success: false, 
                    message: "Not found- invalid parameter", 
                    statusCode: 404
                })
            }
        }

        

    } catch (error) {
        console.log(error)
        return ApiResponse(res, {
            success: false, 
            message: "Interval server error", 
            statusCode: 500, 
            data: error
        })
    }
}