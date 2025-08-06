import { model, InferSchemaType, Schema, Types } from 'mongoose'

/* 
THIS SCHEMA WILL STORE DATA OF EVERY DAY
*/

interface AppStat {
  name: string
  duration: number
  tag: "Productive" | "Time waste" | "Untagged"
  sessions: AppSession[]
}

interface AppUsage {
    userId: Types.ObjectId
    totalActiveTime: number,
    appStats: AppStat[],
    date: String,
}

interface AppSession{
    startTime: Date,
    endTime: Date,
    duration: number
}

const AppSessionSchema = new Schema<AppSession>({
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        duration: { type: Number, required: true },
    },
    { _id: false }
) // contains info about the session(lets say of VSCODE)

const AppStatSchema = new Schema<AppStat>({
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
        default: "Untagged"
    },
    sessions: [AppSessionSchema],
}) // contains stats of app by name with multiple sessions(in a day)

const AppUsageSchema = new Schema<AppUsage>({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    date: {
        type: String,
        require: true
    },
    totalActiveTime: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    appStats: { 
        type: [AppStatSchema], 
        default: [] 
    }
    }, {
    timestamps: true
})

AppUsageSchema.index({ userId: 1, date: -1 }, { unique: true });

export const AppUsageModel = model<AppUsage>("AppUsage", AppUsageSchema)