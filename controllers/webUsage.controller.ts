import { Request, Response } from 'express'
import { ApiResponse } from '../utils/ApiResponse'
import { WebsiteUsageModel } from '../models/websiteUsage.model'

export const updateWebsiteUsage = async (req: Request, res: Response) => {
    try {
        const {userId, date, websiteURL, totalActiveTime, sessions} = req.body
        if(!date || !websiteURL || !sessions || !totalActiveTime){
            return ApiResponse(res, {
                success: false, 
                message: "All fields are required",
                statusCode: 400
            })
        }

        const hasUser = await WebsiteUsageModel.findOne({userId, date}) 
        // will find data related to the website on that date for a user

        if(!hasUser) {  //user has no record for this date
            const stats = [
                {
                    name: websiteURL,
                    tag: "Untagged",
                    duration: 0,
                    sessions
                }
            ]
            const createdUser = await WebsiteUsageModel.create({userId, date, totalActiveTime, websiteStats: stats})
            return ApiResponse(res, {
                success: true,
                data: createdUser,
                statusCode: 200,
                message: "Usage Updated"
            })
        }
        // user had few records of some websites then: 
        const websitesData = hasUser.websiteStats // websitedata array

        for(const webObject of websitesData){
            if(webObject.name === websiteURL) {
                const webSessions = webObject.sessions
                for(const session of sessions){
                    webSessions.push(session)
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

        // If data of that website isnt created on that day.then create it
        websitesData.push({
            name: websiteURL,
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
