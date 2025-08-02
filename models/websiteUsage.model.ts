import { model, Schema, Types } from 'mongoose'

/* 
THIS SCHEMA WILL STORE DATA OF EVERY DAY
*/

interface WebsiteStat {
    name: string
    duration: number
    tag: "Productive" | "Time waste" | "Untagged"
    sessions: WebsiteSession[]
}

interface WebsiteUsage {
    userId: Types.ObjectId
    totalActiveTime: number,
    websiteStats: WebsiteStat[],
    date: String,
}

interface WebsiteSession {
    startTime: Date,
    endTime: Date,
    duration: number
}

const WebsiteSessionSchema = new Schema<WebsiteSession>(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        duration: { type: Number, required: true },
    },
    { _id: false }
) // contains info about the session (e.g., of a website)

const WebsiteStatSchema = new Schema<WebsiteStat>({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    tag: {
        type: String,
        enum: ["Productive", "Time waste", "Untagged"],
        required: true
    },
    sessions: [WebsiteSessionSchema],
}) // contains stats of website by name with multiple sessions (in a day)

const WebsiteUsageSchema = new Schema<WebsiteUsage>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    totalActiveTime: {
        type: Number,
        required: true,
        default: 0
    },
    websiteStats: {
        type: [WebsiteStatSchema],
        default: []
    }
}, {
    timestamps: true
})

WebsiteUsageSchema.index({ userId: 1, date: -1 }, { unique: true });

export const WebsiteUsageModel = model<WebsiteUsage>("WebsiteUsage", WebsiteUsageSchema)