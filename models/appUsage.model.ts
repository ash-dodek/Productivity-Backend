import { model, InferSchemaType, Schema, Types } from 'mongoose'


interface AppStat {
  name: string
  duration: number
  lastUsedAt: Date
}

interface AppUsage {
    user: Types.ObjectId,
    date: string,
    totalActiveTime: number
    appStats: AppStat[],

}

const AppStatSchema = new Schema<AppStat>({
    name: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: Number,
        required: true 
    },
    lastUsedAt: {
        type: Date,
        required: true
    }
    // Represents stats of an app, like {Vscode, "3h24m", 24-4-2025}
})

const AppUsageSchema = new Schema<AppUsage>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    date: { 
        type: String, 
        required: true, 
        index: true 
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

export const AppUsageModel = model<AppUsage>("AppUsage", AppUsageSchema)