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

export const getWebsiteUsageByURL = async (req: Request, res: Response) => {
    try {
        const siteName = req.query?.siteName
        const siteId = req.query?.siteId
        const { userId } = (req as any).user
        if(!siteName && !siteId){
            return ApiResponse(res, {
                success: false, 
                message: "Query not passed",
                statusCode: 400
            })
        }

        const userData = await WebsiteUsageModel.findOne({userId})
        if(!userData) {
            return ApiResponse(res, {
                success: false,
                message: "No usage for the website",
                statusCode: 404
            })
        }
        const sitesData = userData.websiteStats
        // UPDATE LOGIC, TO GET ALL INFO OF AN APP, for a given date or all
        for(const siteData of sitesData) {
            if((siteName && siteData.name.toLowerCase() === (siteName as any).toLowerCase()) || ((siteData as any)._id.toString() === siteId)) {
                return ApiResponse(res, {
                    success: true,
                    message: "Usage provided",
                    data: siteData,
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
        })
    }
}