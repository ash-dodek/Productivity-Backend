import mongoose, { Document, InferSchemaType, model, Schema } from "mongoose"

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    settings: {
        timeFormat: {
            type: String,
            enum: ["24h", "12h"],
            default: "12h"
        }
    },
}, { timestamps: true })

type userType = InferSchemaType<typeof UserSchema>

export const UserModel = model<userType>("User", UserSchema)